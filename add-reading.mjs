// didnt wnat to reseed the beinin seed, so this script just adds to the existing script

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

// this drops empty values so optional fields are simply left out.
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

async function main() {
  await signIn();

  // this finds the exhibition and its chapters, so each book can be linked by chapter slug.
  const exhibition = (
    await call("GET", `/exhibitions/${benin.exhibition.slug}`)
  ).json.data;
  const sections = (
    await call("GET", `/sections/admin/exhibitions/${exhibition.id}`)
  ).json.data;
  const sectionId = Object.fromEntries(
    sections.map((section) => [section.slug, section.id]),
  );

  for (const item of reading) {
    const { json } = await call(
      "POST",
      "/sources",
      clean({
        title: item.title,
        author: item.author,
        publication: item.publication,
        sourceType: item.sourceType,
        publicationDate: item.publicationDate,
        url: item.url,
        coverImageUrl: item.coverImageUrl,
        rightsStatement: item.rightsStatement,
        perspectiveNote: item.note,
      }),
    );

    for (const slug of item.chapters) {
      if (!sectionId[slug])
        throw new Error(`No chapter with the slug "${slug}"`);

      await call("POST", "/source-links", {
        sourceId: json.data.id,
        sectionId: sectionId[slug],
        relationship: "further_reading",
      });
    }

    console.log("Added:", item.title);
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("\nStopped:", error.message);
  process.exit(1);
});
