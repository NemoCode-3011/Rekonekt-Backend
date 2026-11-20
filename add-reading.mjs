// Adds the "Further reading" books and papers to the Benin exhibition.
// Safe to run more than once: it reuses books that already exist and only adds
// the chapter links that are missing, so it never makes duplicates.
//
// Run it AFTER seed-benin.mjs, from your backend folder:
//   node --env-file=.env add-reading.mjs

import { benin, reading } from "./benin-data.mjs";

const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
let cookie = "";

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

async function getData(path) {
  const { json } = await call("GET", path);
  return json.data;
}

// Drops empty values so optional fields are simply left out.
function clean(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value != null),
  );
}

// The backend only accepts a full date (YYYY-MM-DD), so "2001" becomes "2001-01-01".
function toDate(value) {
  return /^\d{4}$/.test(value ?? "") ? `${value}-01-01` : value;
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

async function main() {
  await signIn();
  console.log("Signed in.");

  // Find the exhibition and its chapters, so each book can be linked by chapter slug.
  const exhibition = await getData(`/exhibitions/${benin.exhibition.slug}`);
  const sections = await getData(`/sections/admin/exhibitions/${exhibition.id}`);
  const sectionId = Object.fromEntries(
    sections.map((section) => [section.slug, Number(section.id)]),
  );

  // What already exists, so nothing is added twice.
  const sources = await getData("/sources");
  const links = await getData("/source-links");

  let created = 0;
  let reused = 0;
  let linked = 0;
  let alreadyLinked = 0;

  for (const item of reading) {
    const matches = sources.filter(
      (record) =>
        record.title === item.title && record.source_type === item.sourceType,
    );

    if (matches.length > 1) {
      throw new Error(
        `"${item.title}" already exists ${matches.length} times. Delete the extra copies in the admin, then run this again.`,
      );
    }

    let sourceId;

    if (matches.length === 1) {
      sourceId = Number(matches[0].id);
      reused += 1;

      if ((matches[0].cover_image_url ?? "") !== (item.coverImageUrl ?? "")) {
        console.log(
          `  note: the saved cover for "${item.title}" is different from the one in benin-data.mjs. Change it in the admin if you want the new one.`,
        );
      }
    } else {
      const { json } = await call(
        "POST",
        "/sources",
        clean({
          title: item.title,
          author: item.author,
          publication: item.publication,
          sourceType: item.sourceType,
          publicationDate: toDate(item.publicationDate),
          url: item.url,
          coverImageUrl: item.coverImageUrl,
          rightsStatement: item.rightsStatement,
          perspectiveNote: item.note,
        }),
      );
      sourceId = Number(json.data.id);
      sources.push(json.data);
      created += 1;
    }

    for (const slug of item.chapters) {
      const target = sectionId[slug];
      if (!target) throw new Error(`No chapter with the slug "${slug}"`);

      const exists = links.some(
        (link) =>
          Number(link.source_id) === sourceId &&
          Number(link.section_id) === target,
      );

      if (exists) {
        alreadyLinked += 1;
        continue;
      }

      const { json } = await call("POST", "/source-links", {
        sourceId,
        sectionId: target,
        relationship: "further_reading",
      });
      links.push(json.data);
      linked += 1;
    }

    console.log("Checked:", item.title);
  }

  console.log(
    `\nDone. ${created} books added, ${reused} already existed. ${linked} chapter links added, ${alreadyLinked} were already there.`,
  );
}

main().catch((error) => {
  console.error("\nStopped:", error.message);
  process.exit(1);
});
