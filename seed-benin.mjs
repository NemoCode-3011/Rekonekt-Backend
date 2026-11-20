// Loads the Benin exhibition into REKÒ through the API.
// Run from your backend folder:   node --env-file=.env seed-benin.mjs
// Resume after the source stage failed: node --env-file=.env seed-benin.mjs --resume-sources
// The backend must be running. Everything is created as a draft, then published.

import { benin } from "./benin-data.mjs";

const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
let cookie = "";

// Sends one request. Stops with a clear message if the API says no.
async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      `${method} ${path} -> ${res.status}: ${json.message ?? "no message"}`,
    );
  }

  return { json, res };
}

// Creates something and returns its new id.
async function create(path, body) {
  const { json } = await call("POST", path, body);

  if (!json.data?.id) throw new Error(`No id came back from POST ${path}`);

  return json.data.id;
}

// Drops empty values so optional fields are simply left out.
function clean(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value != null),
  );
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sourceSlug(source) {
  const stableKey = slugify(source.key);
  let slug = slugify(source.slug ?? "");

  if (!slug) {
    if (!stableKey) {
      throw new Error(`Source "${source.key}" cannot produce a slug`);
    }

    const suffix = `-${stableKey}`;
    const titleSlug = slugify(source.title) || "source";
    slug = `${titleSlug.slice(0, 255 - suffix.length).replace(/-+$/g, "")}${suffix}`;
  }

  if (slug.length < 2 && stableKey) slug = `${slug || "source"}-${stableKey}`;
  if (
    slug.length > 255 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    throw new Error(`Source "${source.key}" has an invalid slug: ${slug}`);
  }

  return slug;
}

function validateSeedData(data) {
  const collections = {
    sections: data.sections,
    people: data.people,
    places: data.places,
    events: data.events,
    artifacts: data.artifacts,
    sources: data.sources,
  };
  const keys = {};

  for (const [name, records] of Object.entries(collections)) {
    if (!Array.isArray(records)) {
      throw new Error(`Invalid Benin seed data: ${name} must be an array`);
    }

    keys[name] = new Set();
    for (const record of records) {
      if (typeof record.key !== "string" || !record.key.trim()) {
        throw new Error(`Invalid Benin seed data: ${name} record has no key`);
      }
      if (keys[name].has(record.key)) {
        throw new Error(
          `Invalid Benin seed data: duplicate ${name} key "${record.key}"`,
        );
      }
      keys[name].add(record.key);
    }
  }

  const requireText = (value, label) => {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Invalid Benin seed data: ${label} is required`);
    }
  };
  const requireReference = (collection, key, label) => {
    if (typeof key !== "string" || !keys[collection]?.has(key)) {
      throw new Error(
        `Invalid Benin seed data: ${label} references missing ${collection} key "${key}"`,
      );
    }
  };
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const requireValidSlug = (slug, label) => {
    if (typeof slug !== "string" || !slugPattern.test(slug)) {
      throw new Error(`Invalid Benin seed data: ${label} must be a lowercase, hyphenated slug`);
    }
  };

  requireText(data.exhibition?.title, "exhibition title");
  requireText(data.exhibition?.slug, "exhibition slug");
  requireValidSlug(data.exhibition.slug, "exhibition slug");
  for (const section of data.sections) {
    requireText(section.title, `section "${section.key}" title`);
    requireValidSlug(section.slug, `section "${section.key}" slug`);
  }
  for (const person of data.people) {
    requireText(person.name, `person "${person.key}" name`);
    requireValidSlug(person.slug, `person "${person.key}" slug`);
  }
  for (const place of data.places) {
    requireText(place.name, `place "${place.key}" name`);
    if (
      !Number.isFinite(place.latitude) ||
      place.latitude < -90 ||
      place.latitude > 90 ||
      !Number.isFinite(place.longitude) ||
      place.longitude < -180 ||
      place.longitude > 180
    ) {
      throw new Error(
        `Invalid Benin seed data: place "${place.key}" has invalid coordinates`,
      );
    }
  }
  for (const event of data.events) {
    requireText(event.title, `event "${event.key}" title`);
    requireValidSlug(event.slug, `event "${event.key}" slug`);
    if (event.section) {
      requireReference("sections", event.section, `event "${event.key}"`);
    }
    for (const key of event.people ?? []) {
      requireReference("people", key, `event "${event.key}"`);
    }
    for (const key of event.places ?? []) {
      requireReference("places", key, `event "${event.key}"`);
    }
  }
  for (const artifact of data.artifacts) {
    requireText(artifact.title, `artifact "${artifact.key}" title`);
    requireText(artifact.artifactType, `artifact "${artifact.key}" type`);
    requireValidSlug(artifact.slug, `artifact "${artifact.key}" slug`);
    requireReference("sections", artifact.section, `artifact "${artifact.key}"`);
    if (artifact.place) {
      requireReference("places", artifact.place, `artifact "${artifact.key}"`);
    }
  }
  for (const source of data.sources) {
    requireText(source.title, `source "${source.key}" title`);
    requireText(source.sourceType, `source "${source.key}" type`);
  }

  for (const [field, collection] of [
    ["sectionPeople", "people"],
    ["sectionPlaces", "places"],
  ]) {
    for (const [section, recordKeys] of Object.entries(data[field] ?? {})) {
      requireReference("sections", section, `${field}`);
      for (const key of recordKeys) {
        requireReference(collection, key, `${field} section "${section}"`);
      }
    }
  }

  const citationTargets = {
    section: "sections",
    person: "people",
    place: "places",
    event: "events",
    artifact: "artifacts",
  };
  for (const [type, records] of Object.entries(data.citations ?? {})) {
    const collection = citationTargets[type];
    if (!collection) {
      throw new Error(`Invalid Benin seed data: unknown citation target type "${type}"`);
    }
    for (const [key, sourceKeys] of Object.entries(records)) {
      requireReference(collection, key, `citation target "${type}"`);
      for (const sourceKey of sourceKeys) {
        requireReference("sources", sourceKey, `citation for "${type}/${key}"`);
      }
    }
  }

  const slugs = new Set();
  for (const source of data.sources) {
    const slug = sourceSlug(source);
    if (slugs.has(slug)) {
      throw new Error(
        `Invalid Benin seed data: duplicate source slug "${slug}"`,
      );
    }
    slugs.add(slug);
  }
}

async function getData(path) {
  const { json } = await call("GET", path);
  return json.data;
}

function getUniqueRecord(records, matches, label) {
  if (!Array.isArray(records)) {
    throw new Error(`Cannot resume safely: ${label} list was not returned`);
  }

  const found = records.filter(matches);
  if (found.length !== 1) {
    throw new Error(
      `Cannot resume safely: expected one ${label}, found ${found.length}`,
    );
  }
  return found[0];
}

function getRecordId(record, label) {
  const id = Number(record.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`Cannot resume safely: ${label} has no valid ID`);
  }
  return id;
}

async function loadExistingIds(data, ids) {
  const exhibitionList = await getData("/exhibitions/admin");
  const exhibition = getUniqueRecord(
    exhibitionList?.exhibitions,
    (record) =>
      record.slug === data.exhibition.slug &&
      record.title === data.exhibition.title,
    `exhibition "${data.exhibition.slug}"`,
  );
  const exhibitionId = getRecordId(exhibition, "exhibition");

  const sectionRows = await getData(
    `/sections/admin/exhibitions/${exhibitionId}`,
  );
  const peopleRows = await getData("/people/admin");
  const placeRows = await getData("/places/admin");
  const eventRows = await getData("/events/admin");
  const artifactRows = await getData("/artifacts/admin");

  for (const section of data.sections) {
    const record = getUniqueRecord(
      sectionRows,
      (row) => row.slug === section.slug,
      `section "${section.key}"`,
    );
    ids.section[section.key] = getRecordId(record, `section "${section.key}"`);
  }

  for (const person of data.people) {
    const record = getUniqueRecord(
      peopleRows,
      (row) => row.slug === person.slug && row.name === person.name,
      `person "${person.key}"`,
    );
    ids.person[person.key] = getRecordId(record, `person "${person.key}"`);
  }

  for (const place of data.places) {
    const record = getUniqueRecord(
      placeRows,
      (row) =>
        row.name === place.name &&
        Math.abs(Number(row.latitude) - place.latitude) <= 0.00000005 &&
        Math.abs(Number(row.longitude) - place.longitude) <= 0.00000005,
      `place "${place.key}"`,
    );
    ids.place[place.key] = getRecordId(record, `place "${place.key}"`);
  }

  for (const event of data.events) {
    const sectionId = event.section ? ids.section[event.section] : null;
    const record = getUniqueRecord(
      eventRows,
      (row) =>
        row.slug === event.slug &&
        row.title === event.title &&
        (sectionId === null
          ? row.section_id == null
          : Number(row.section_id) === sectionId),
      `event "${event.key}"`,
    );
    ids.event[event.key] = getRecordId(record, `event "${event.key}"`);
  }

  for (const artifact of data.artifacts) {
    const record = getUniqueRecord(
      artifactRows,
      (row) =>
        row.slug === artifact.slug &&
        row.title === artifact.title &&
        Number(row.section_id) === ids.section[artifact.section],
      `artifact "${artifact.key}"`,
    );
    ids.artifact[artifact.key] = getRecordId(
      record,
      `artifact "${artifact.key}"`,
    );
  }

  return exhibitionId;
}

function sameOptionalValue(actual, expected) {
  return (actual ?? null) === (expected ?? null);
}

function matchesSource(record, source) {
  return (
    record.title === source.title &&
    record.source_type === source.sourceType &&
    sameOptionalValue(record.publication, source.publication) &&
    sameOptionalValue(record.url, source.url) &&
    sameOptionalValue(record.citation, source.citation) &&
    sameOptionalValue(record.perspective_note, source.note) &&
    sameOptionalValue(record.cover_image_url, source.coverImageUrl)
  );
}

async function signIn() {
  const { res } = await call("POST", "/auth/signin", {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  });

  const cookies = res.headers.getSetCookie?.() ?? [
    res.headers.get("set-cookie"),
  ];
  const session = cookies.find((item) => item?.startsWith("sessionId="));

  if (!session) throw new Error("Signed in, but no session cookie came back");

  cookie = session.split(";")[0];
}

// Uploads nothing: it records an image that already lives at a web address,
// then attaches it to one item. Skipped when there is no url yet.
async function attachImage(image, title, target) {
  if (!image?.url) return;

  const mediaId = await create(
    "/media",
    clean({
      title,
      mediaType: "image",
      fileUrl: image.url,
      sourceCredit: image.credit,
      license: image.license,
    }),
  );

  await call("POST", "/media-attachment", {
    mediaId,
    ...target,
    displayOrder: 0,
  });
}

async function main() {
  const ids = {
    section: {},
    person: {},
    place: {},
    event: {},
    artifact: {},
    source: {},
  };
  const data = benin;

  validateSeedData(data);
  await signIn();
  console.log("Signed in.");

  const ex = data.exhibition;
  const resumeAtSources = process.argv.includes("--resume-sources");
  let exhibitionId;

  if (resumeAtSources) {
    exhibitionId = await loadExistingIds(data, ids);
    console.log("Verified existing Benin records. Resuming at sources.");
  } else {
    const exhibitionList = await getData("/exhibitions/admin");
    const existing = (exhibitionList?.exhibitions ?? []).filter(
      (record) => record.slug === ex.slug,
    );
    if (existing.length) {
      throw new Error(
        `Exhibition "${ex.slug}" already exists. Use --resume-sources only if the previous seed stopped during step 7.`,
      );
    }

    // 1. The exhibition
    exhibitionId = await create(
      "/exhibitions",
      clean({
        title: ex.title,
        slug: ex.slug,
        subtitle: ex.subtitle,
        description: ex.description,
        startDate: ex.startDate,
        coverImageUrl: ex.image.url,
      }),
    );
    console.log("Exhibition created.");
  }

  if (!resumeAtSources) {
    // 2. Chapters, in order
    for (const [index, section] of data.sections.entries()) {
      ids.section[section.key] = await create(
        "/sections",
        clean({
          exhibitionId,
          title: section.title,
          slug: section.slug,
          introduction: section.introduction,
          sectionOrder: index + 1,
          heroImageUrl: section.image.url,
        }),
      );
    }
    console.log(`${data.sections.length} chapters created.`);

    // 3. People and places
    for (const person of data.people) {
      ids.person[person.key] = await create(
        "/people",
        clean({
          name: person.name,
          slug: person.slug,
          description: person.description,
          birthDate: person.birthDate,
          deathDate: person.deathDate,
        }),
      );
      await attachImage(person.image, person.name, {
        personId: ids.person[person.key],
      });
    }

    for (const place of data.places) {
      ids.place[place.key] = await create(
        "/places",
        clean({
          name: place.name,
          description: place.description,
          latitude: place.latitude,
          longitude: place.longitude,
        }),
      );
      await attachImage(place.image, place.name, {
        placeId: ids.place[place.key],
      });
    }
    console.log("People and places created.");

    // 4. Events, with the people and places they involve
    for (const event of data.events) {
      const id = await create(
        "/events",
        clean({
          sectionId: ids.section[event.section],
          title: event.title,
          slug: event.slug,
          description: event.description,
          eventDate: event.eventDate,
          dateDisplay: event.dateDisplay,
          imageUrl: event.image.url,
        }),
      );
      ids.event[event.key] = id;

      for (const key of event.people ?? []) {
        await call("POST", `/events/${id}/people`, { personId: ids.person[key] });
      }
      for (const key of event.places ?? []) {
        await call("POST", `/events/${id}/places`, { placeId: ids.place[key] });
      }
    }
    console.log("Events created.");

    // 5. Artifacts
    for (const artifact of data.artifacts) {
      const id = await create(
        "/artifacts",
        clean({
          sectionId: ids.section[artifact.section],
          title: artifact.title,
          slug: artifact.slug,
          artifactType: artifact.artifactType,
          description: artifact.description,
          historicalContext: artifact.historicalContext,
          dateDisplay: artifact.dateDisplay,
          placeId: ids.place[artifact.place],
        }),
      );
      ids.artifact[artifact.key] = id;
      await attachImage(artifact.image, artifact.title, { artifactId: id });
    }
    console.log("Artifacts created.");

    // 6. Which people and places appear in which chapter
    for (const [section, keys] of Object.entries(data.sectionPeople)) {
      for (const [order, key] of keys.entries()) {
        await call("POST", `/sections/${ids.section[section]}/people`, {
          personId: ids.person[key],
          displayOrder: order,
        });
      }
    }
    for (const [section, keys] of Object.entries(data.sectionPlaces)) {
      for (const [order, key] of keys.entries()) {
        await call("POST", `/sections/${ids.section[section]}/places`, {
          placeId: ids.place[key],
          displayOrder: order,
        });
      }
    }
    console.log("Chapters linked to people and places.");
  }

  // 7. Sources, then the links from each item to its sources
  const sourceRows = await getData("/sources");
  const missingSources = [];
  for (const source of data.sources) {
    const existing = sourceRows.filter((record) =>
      matchesSource(record, source),
    );
    if (existing.length > 1) {
      throw new Error(
        `Cannot resume safely: multiple source records match "${source.key}"`,
      );
    }

    if (existing.length === 1) {
      ids.source[source.key] = getRecordId(
        existing[0],
        `source "${source.key}"`,
      );
    } else {
      missingSources.push(source);
    }
  }

  for (const source of missingSources) {
    ids.source[source.key] = await create(
      "/sources",
      clean({
        title: source.title,
        slug: sourceSlug(source),
        publication: source.publication,
        sourceType: source.sourceType,
        url: source.url,
        citation: source.citation,
        perspectiveNote: source.note,
        coverImageUrl: source.coverImageUrl,
      }),
    );
  }

  const targetField = {
    section: "sectionId",
    person: "personId",
    place: "placeId",
    event: "eventId",
    artifact: "artifactId",
  };
  const targetColumn = {
    section: "section_id",
    person: "person_id",
    place: "place_id",
    event: "event_id",
    artifact: "artifact_id",
  };

  const sourceLinks = await getData("/source-links");
  let linkCount = 0;
  for (const [type, items] of Object.entries(data.citations)) {
    for (const [key, sourceKeys] of Object.entries(items)) {
      for (const [order, sourceKey] of sourceKeys.entries()) {
        const sourceId = ids.source[sourceKey];
        const targetId = ids[type][key];
        const matchingLinks = sourceLinks.filter(
          (link) =>
            Number(link.source_id) === sourceId &&
            Number(link[targetColumn[type]]) === targetId,
        );
        if (matchingLinks.length > 1) {
          throw new Error(
            `Cannot resume safely: duplicate citation link for ${type}/${key} and ${sourceKey}`,
          );
        }

        if (matchingLinks.length === 1) {
          const link = matchingLinks[0];
          if (
            link.relationship !== "cited" ||
            Number(link.display_order) !== order
          ) {
            await call("PATCH", `/source-links/${link.id}`, {
              relationship: "cited",
              displayOrder: order,
            });
          }
        } else {
          const { json } = await call("POST", "/source-links", {
            sourceId,
            [targetField[type]]: targetId,
            relationship: "cited",
            displayOrder: order,
          });
          sourceLinks.push(json.data);
        }
        linkCount += 1;
      }
    }
  }
  console.log(
    `${data.sources.length} sources verified, ${linkCount} links verified.`,
  );

  // 8. Publish everything, the exhibition last
  for (const [path, group] of [
    ["people", ids.person],
    ["places", ids.place],
    ["events", ids.event],
    ["artifacts", ids.artifact],
  ]) {
    for (const id of Object.values(group)) {
      await call("PATCH", `/${path}/${id}/publish`);
    }
  }
  await call("PATCH", `/exhibitions/${exhibitionId}/publish`);

  console.log("\nDone. Published: /exhibitions/" + ex.slug);
  console.log("Experience:       /experiences/" + ex.slug);
}

main().catch((error) => {
  console.error("\nStopped:", error.message);
  console.error("No changes are rolled back.");
  console.error("If this stopped at sources, rerun with --resume-sources.");
  process.exit(1);
});
