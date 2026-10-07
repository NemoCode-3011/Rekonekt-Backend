// Loads the Benin exhibition into REKÒ through the API.
// Run from your backend folder:   node --env-file=.env seed-benin.mjs
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

  await signIn();
  console.log("Signed in.");

  // 1. The exhibition
  const ex = data.exhibition;
  const exhibitionId = await create(
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

  // 7. Sources, then the links from each item to its sources
  for (const source of data.sources) {
    ids.source[source.key] = await create(
      "/sources",
      clean({
        title: source.title,
        publication: source.publication,
        sourceType: source.sourceType,
        url: source.url,
        citation: source.citation,
        perspectiveNote: source.note,
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

  let linkCount = 0;
  for (const [type, items] of Object.entries(data.citations)) {
    for (const [key, sourceKeys] of Object.entries(items)) {
      for (const [order, sourceKey] of sourceKeys.entries()) {
        await call("POST", "/source-links", {
          sourceId: ids.source[sourceKey],
          [targetField[type]]: ids[type][key],
          relationship: "cited",
          displayOrder: order,
        });
        linkCount += 1;
      }
    }
  }
  console.log(
    `${data.sources.length} sources created, ${linkCount} links made.`,
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
  console.error(
    "Nothing is rolled back. See the cleanup note before running again.",
  );
  process.exit(1);
});
