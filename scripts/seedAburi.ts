import "dotenv/config";
import type { PoolClient } from "pg";
import { pool } from "../src/database/db";

type IdRow = { id: number };

const exhibition = {
  title: "The Aburi Accord",
  slug: "aburi",
};

const sectionData = [
  {
    slug: "entrance",
    title: "Entrance",
    section_order: 1,
    introduction: `ABURI - The meeting before the war

In January 1967, military leaders from across Nigeria met in Aburi, Ghana. They sought to prevent their country from falling apart. Four months later, war began.

What was agreed at Aburi? How was it later interpreted? And why did the effort at settlement collapse?

Welcome to "Aburi: The Agreement Before the War." This exhibition focuses on the critical months between January and May 1967 - the period when Nigeria's leaders attempted negotiation, issued competing decrees, and ultimately failed to prevent the declaration of the Republic of Biafra.

The exhibition uses primary sources including the Aburi Accord, Decree No. 8, diplomatic cables, broadcasts, and proclamations. Where accounts conflict, attribute the interpretation rather than presenting it as settled fact.

This is not a complete history of the Nigerian Civil War. It is a focused examination of one failed agreement - and the questions it raises about trust, interpretation, and the fragility of political settlement.`,
  },
  {
    slug: "before-aburi",
    title: "Before Aburi",
    section_order: 2,
    introduction:
      "By late 1966, Nigeria was in crisis. Two coups, a counter-coup, and widespread violence had shattered trust between regions. The Supreme Military Council sought a final attempt at unity.",
  },
  {
    slug: "journey-to-aburi",
    title: "Journey to Aburi",
    section_order: 3,
    introduction:
      "In early January 1967, Nigeria's military leaders traveled to Aburi, Ghana. Ghanaian Head of State Lieutenant-General Joseph Ankrah hosted and mediated the meeting. The goal was a negotiated settlement to prevent further escalation.",
  },
  {
    slug: "the-meeting",
    title: "The Meeting",
    section_order: 4,
    introduction: `At Aburi, the Supreme Military Council produced a fifteen-point agreement.

The agreement provided for the Army to be governed by the Supreme Military Council under the Commander-in-Chief, with equal regional representation at Military Headquarters. Area Commands were to correspond to the regions, with Military Governors controlling them for internal security.

Law Officers were to list decrees that reduced regional powers. Relevant decrees were to be repealed, if possible, by January 21, 1967.

Displaced civil servants and corporation staff were to continue receiving salaries until March 31, 1967, subject to the agreement's stated conditions. Government media were to avoid inflammatory statements. Another Supreme Military Council meeting was to take place within Nigeria at a mutually agreed venue.`,
  },
  {
    slug: "after-aburi",
    title: "After Aburi",
    section_order: 5,
    introduction:
      "After Aburi, implementation became disputed. On March 17, 1967, Gowon issued Decree No. 8. The Federal Government presented it as a major decentralisation measure. Ojukwu rejected it as failing to fulfil the Aburi agreement.",
  },
  {
    slug: "road-to-war",
    title: "Road to War",
    section_order: 6,
    introduction:
      "By May 1967, negotiations had collapsed. On May 27, Gowon announced the creation of twelve states. On May 30, Ojukwu proclaimed the Republic of Biafra.",
  },
  {
    slug: "what-remains",
    title: "What Remains",
    section_order: 7,
    introduction: `The Aburi Agreement failed. War followed. But the questions it raised - about federal authority, regional autonomy, trust, and the fragility of political settlement - remain.

This exhibition has focused on January-May 1967: the Aburi Talks, the dispute over implementation, and the escalation toward the declaration of Biafra.

The records show deep disagreement over constitutional authority, security, secession, and implementation.

Where evidence conflicts, present the sources and attribute each interpretation.

What does it take for an agreement to survive distrust?
How should contested historical claims be presented?
What is the role of primary sources in understanding political settlement?`,
  },
] as const;

const peopleData = [
  { slug: "yakubu-gowon", name: "Yakubu Gowon" },
  {
    slug: "chukwuemeka-odumegwu-ojukwu",
    name: "Chukwuemeka Odumegwu Ojukwu",
  },
  { slug: "aguiyi-ironsi", name: "Aguiyi-Ironsi" },
  {
    slug: "joseph-ankrah",
    name: "Joseph Ankrah",
    description:
      "Ghanaian Head of State Lieutenant-General Joseph Ankrah hosted and mediated the meeting.",
  },
] as const;

const placeNames = ["Aburi", "Lagos", "Enugu", "Eastern Nigeria"] as const;

const sourceData = [
  {
    key: "S1",
    title: "Telegram From the Department of State to the Embassy in Nigeria",
    author: "U.S. Department of State, Office of the Historian",
    publication: "Foreign Relations of the United States, 1964-1968, Vol. XXIV",
    source_type: "Primary diplomatic record",
    publication_date: "1967-03-24",
    url: "https://history.state.gov/historicaldocuments/frus1964-68v24/d378",
    citation:
      'U.S. Department of State, Office of the Historian, "Telegram From the Department of State to the Embassy in Nigeria," 24 March 1967, Foreign Relations of the United States, 1964-1968, Vol. XXIV, Document 378.',
    perspective_note:
      "On March 24, 1967, the U.S. Department of State reported that Decree No. 8 appeared to meet many of the East's fundamental demands for greater regional autonomy. This is the Department's attributed assessment, not an objective or uncontested conclusion.",
  },
  {
    key: "S2",
    title: "Telegram From the Embassy in Nigeria to the Department of State",
    author: "U.S. Department of State, Office of the Historian",
    publication: "Foreign Relations of the United States, 1964-1968, Vol. XXIV",
    source_type: "Primary diplomatic record",
    publication_date: "1967-04-12",
    url: "https://history.state.gov/historicaldocuments/frus1964-68v24/d379",
    citation:
      'U.S. Department of State, Office of the Historian, "Telegram From the Embassy in Nigeria to the Department of State," 12 April 1967, Foreign Relations of the United States, 1964-1968, Vol. XXIV, Document 379.',
    perspective_note:
      "Primary diplomatic record; records the Embassy's account of a conversation with Ojukwu and reports his position.",
  },
  {
    key: "S3",
    title:
      "Official Record of the Minutes of the Meeting of Nigeria's Military Leaders held at Aburi",
    author: null,
    publication: "Dawodu.com",
    source_type: "Reproduction of historical meeting minutes",
    publication_date: "1967-01-04",
    url: "https://www.dawodu.com/aburi2.htm",
    legacy_url: "https://oblongmedia.net/category/politics/",
    citation:
      "\"Official Record of the Minutes of the Meeting of Nigeria's Military Leaders held at Aburi,\" Dawodu.com reproduction, 4-5 January 1967.",
    perspective_note:
      "Dawodu reproduction labelled as the official minutes. Verify against an official Government Printer record before treating this reproduction as an authoritative original.",
  },
  {
    key: "S4",
    title: "Decree No. 8 of 1967",
    author: null,
    publication: "Dawodu.com",
    source_type: "Reproduction of historical document",
    publication_date: "1967-03-17",
    url: "https://www.dawodu.com/decree8.htm",
    citation: "Decree No. 8 of 1967, Dawodu.com reproduction.",
    perspective_note:
      "Reproduction; compare with the Official Gazette record referenced by the University of Ibadan Repository.",
  },
  {
    key: "S5",
    title: "Gowon's broadcast to the nation - May 27, 1967",
    author: null,
    publication: "Dawodu.com",
    source_type: "Reproduction/transcript",
    publication_date: "1967-05-27",
    url: "https://www.dawodu.com/gowon.htm",
    citation:
      "Gowon's broadcast to the nation - May 27, 1967, Dawodu.com reproduction/transcript.",
    perspective_note:
      "Reproduction/transcript; contemporaneous recording or newspaper provenance should be sought.",
  },
  {
    key: "S6",
    title: "The Biafran Declaration of Independence",
    author: "American Historical Association; David Trask",
    publication: "Biafra, Nigeria, the West and the World",
    source_type: "Educational resource reproducing a published text",
    publication_date: null,
    url: "https://www.historians.org/resource/biafran-declaration-of-independence/",
    citation:
      'American Historical Association, "The Biafran Declaration of Independence," reproducing C. Odumegwu Ojukwu, Biafra Selected Speeches and Random Thoughts of C. Odumegwu Ojukwu (New York: Harper & Row, 1969), 191–196.',
    perspective_note:
      "AHA educational resource developed in 2004, credited to David Trask. It reproduces text attributed to Ojukwu's 1969 published speeches, including the May 27 resolution and the declaration. Distinguish the reproduced text from the page's editorial framing; claims within the declaration are attributed to its authors.",
  },
  {
    key: "S6b",
    title: "Erklæring af 30. maj 1967 om Biafra",
    author: null,
    publication: "Danish Parliament",
    source_type:
      "Official parliamentary document containing a reproduction/version",
    publication_date: "1967-05-30",
    url: "https://www.ft.dk/samling/20161/almdel/URU/bilag/213/1767655.pdf",
    citation:
      "Erklæring af 30. maj 1967 om Biafra, Danish Parliament document.",
    perspective_note:
      "Official parliamentary document containing a reproduction/version of the proclamation.",
  },
  {
    key: "S7",
    title:
      "Decree No. 8 and Official Extraordinary Gazette No. 16, vol. 54",
    author: null,
    publication: "University of Ibadan Repository",
    source_type: "Repository record referencing an official gazette",
    publication_date: "1967-03-17",
    url: "https://repository.ui.edu.ng/server/api/core/bitstreams/841e6c1c-48ac-4cda-ab64-bc01afdd25b5/content",
    citation:
      "University of Ibadan Repository record referencing Decree No. 8 and Official Extraordinary Gazette No. 16, vol. 54, 17 March 1967.",
    perspective_note: "Use to pursue the official Gazette scan.",
  },
] as const;

const artifactData = [
  {
    slug: "aburi-accord",
    title: "The Aburi Accord",
    artifact_type: "Historical Document",
    description:
      "At Aburi, the Supreme Military Council produced a fifteen-point agreement.",
    historical_context:
      "Key clauses addressed military control, federal and regional authority, and restoration of regional powers.",
    date_display: "January 4-5, 1967",
    place_key: "Aburi",
    section_key: "the-meeting",
    source_keys: ["S3"],
  },
  {
    slug: "frus-document-378",
    title: "FRUS Document 378",
    artifact_type: "Historical Document",
    description:
      "Telegram From the Department of State to the Embassy in Nigeria.",
    historical_context: null,
    date_display: "March 24, 1967",
    place_key: null,
    section_key: "after-aburi",
    source_keys: ["S1"],
  },
  {
    slug: "frus-document-379",
    title: "FRUS Document 379",
    artifact_type: "Historical Document",
    description:
      "Telegram From the Embassy in Nigeria to the Department of State.",
    historical_context: null,
    date_display: "April 12, 1967",
    place_key: null,
    section_key: "after-aburi",
    source_keys: ["S2"],
  },
  {
    slug: "decree-no-8-of-1967",
    title: "Decree No. 8 of 1967",
    artifact_type: "Historical Document",
    description: "On March 17, 1967, Gowon issued Decree No. 8.",
    historical_context:
      "The Federal Government presented it as a major decentralisation measure. Ojukwu rejected it as failing to fulfil the Aburi agreement.",
    date_display: "March 17, 1967",
    place_key: null,
    section_key: "after-aburi",
    source_keys: ["S4", "S7"],
  },
  {
    slug: "gowon-broadcast-may-27-1967",
    title: "Gowon's broadcast to the nation",
    artifact_type: "Broadcast transcript",
    description: "Dawodu.com reproduction/transcript of the broadcast.",
    historical_context: null,
    date_display: "May 27, 1967",
    place_key: null,
    section_key: "road-to-war",
    source_keys: ["S5"],
  },
  {
    slug: "biafra-proclamation",
    title: "Biafra Proclamation",
    artifact_type: "Historical Document",
    description: "Reproduction of the Biafra Proclamation.",
    historical_context: null,
    date_display: "May 30, 1967",
    place_key: null,
    section_key: "road-to-war",
    source_keys: ["S6", "S6b"],
  },
] as const;

const eventData = [
  {
    slug: "first-military-coup",
    title: "First military coup",
    date: "1966-01-15",
    date_display: "January 15, 1966",
    description: null,
    section_key: "before-aburi",
    people: [],
    places: [],
    source_keys: [],
  },
  {
    slug: "counter-coup",
    title: "Counter-coup",
    date: "1966-07-29",
    date_display: "July 29, 1966",
    description: null,
    section_key: "before-aburi",
    people: [],
    places: [],
    source_keys: [],
  },
  {
    slug: "displacement-of-civil-servants",
    title: "Widespread displacement of civil servants",
    date: null,
    date_display: "Late 1966",
    description: null,
    section_key: "before-aburi",
    people: [],
    places: [],
    source_keys: [],
  },
  {
    slug: "smc-agrees-to-meet-at-aburi",
    title: "Supreme Military Council agrees to meet in Aburi",
    date: null,
    date_display: "December 1966",
    description: null,
    section_key: "before-aburi",
    people: [],
    places: ["Aburi"],
    source_keys: [],
  },
  {
    slug: "aburi-meeting",
    title: "The Aburi Meeting",
    date: "1967-01-04",
    date_display: "January 4-5, 1967",
    description: "The Supreme Military Council met in Aburi, Ghana.",
    section_key: "the-meeting",
    people: ["yakubu-gowon", "chukwuemeka-odumegwu-ojukwu", "joseph-ankrah"],
    places: ["Aburi"],
    source_keys: ["S3"],
  },
  {
    slug: "law-officers-list-target-date",
    title: "Target date for law officers' list",
    date: "1967-01-14",
    date_display: "January 14, 1967",
    description:
      "Target date for law officers to list decrees reducing regional powers.",
    section_key: "the-meeting",
    people: [],
    places: [],
    source_keys: ["S3"],
  },
  {
    slug: "decree-repeal-target-date",
    title: "Target date for repeal of relevant decrees",
    date: "1967-01-21",
    date_display: "January 21, 1967",
    description:
      "Relevant decrees were to be repealed, if possible, by this date.",
    section_key: "the-meeting",
    people: [],
    places: [],
    source_keys: ["S3"],
  },
  {
    slug: "decree-no-8-issued",
    title: "Decree No. 8 issued",
    date: "1967-03-17",
    date_display: "March 17, 1967",
    description: "Gowon issued Decree No. 8.",
    section_key: "after-aburi",
    people: ["yakubu-gowon", "chukwuemeka-odumegwu-ojukwu"],
    places: [],
    source_keys: ["S1", "S2", "S4", "S7"],
  },
  {
    slug: "creation-of-twelve-states-announced",
    title: "Creation of twelve states announced",
    date: "1967-05-27",
    date_display: "May 27, 1967",
    description: "Gowon announced the creation of twelve states.",
    section_key: "road-to-war",
    people: ["yakubu-gowon"],
    places: [],
    source_keys: ["S5"],
  },
  {
    slug: "biafra-proclaimed",
    title: "Republic of Biafra proclaimed",
    date: "1967-05-30",
    date_display: "May 30, 1967",
    description: "Ojukwu proclaimed the Republic of Biafra.",
    section_key: "road-to-war",
    people: ["chukwuemeka-odumegwu-ojukwu"],
    places: [],
    source_keys: ["S6", "S6b"],
  },
] as const;

const sectionPeople: Record<string, string[]> = {
  "before-aburi": [
    "yakubu-gowon",
    "chukwuemeka-odumegwu-ojukwu",
    "aguiyi-ironsi",
  ],
  "journey-to-aburi": [
    "yakubu-gowon",
    "chukwuemeka-odumegwu-ojukwu",
    "joseph-ankrah",
  ],
  "the-meeting": [
    "yakubu-gowon",
    "chukwuemeka-odumegwu-ojukwu",
    "joseph-ankrah",
  ],
  "after-aburi": ["yakubu-gowon", "chukwuemeka-odumegwu-ojukwu"],
  "road-to-war": ["yakubu-gowon", "chukwuemeka-odumegwu-ojukwu"],
};

const sectionPlaces: Record<string, string[]> = {
  "before-aburi": ["Lagos", "Enugu", "Aburi"],
  "journey-to-aburi": ["Aburi"],
  "the-meeting": ["Aburi"],
  "after-aburi": ["Lagos", "Enugu"],
  "road-to-war": ["Lagos", "Enugu", "Eastern Nigeria"],
};

const SOURCE_BY_KEY = new Map(sourceData.map((source) => [source.key, source]));
const publishedAt = "COALESCE(published_at, CURRENT_TIMESTAMP)";

async function reportPotentialDuplicates(): Promise<void> {
  const candidates = [
    {
      label: "Aburi places",
      query: `SELECT id, name, status
              FROM places
              WHERE LOWER(name) = 'aburi'
              ORDER BY id`,
    },
    {
      label: "Aburi meeting events",
      query: `SELECT id, title, slug, section_id, status
              FROM events
              WHERE LOWER(title) LIKE '%aburi%'
                 OR slug IN ('aburi-meeting', 'the-aburi-meeting')
              ORDER BY id`,
    },
    {
      label: "Aburi Accord artifacts",
      query: `SELECT id, title, slug, section_id, status
              FROM artifacts
              WHERE LOWER(title) LIKE '%aburi accord%'
                 OR slug IN ('aburi-accord', 'aburi-accord-document')
              ORDER BY id`,
    },
  ];

  for (const candidate of candidates) {
    const result = await pool.query(candidate.query);
    if (result.rows.length > 1) {
      console.warn(
        `Potential duplicate ${candidate.label} found. These rows will not be deleted, merged, or silently overwritten; review them separately:`,
      );
      console.warn(JSON.stringify(result.rows, null, 2));
    }
  }
}

async function getOrCreateExhibition(client: PoolClient): Promise<number> {
  const result = await client.query<IdRow>(
    `INSERT INTO exhibitions (title, slug, status, published_at)
     VALUES ($1, $2, 'published', CURRENT_TIMESTAMP)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       status = 'published',
       published_at = COALESCE(exhibitions.published_at, CURRENT_TIMESTAMP),
       updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
    [exhibition.title, exhibition.slug],
  );
  return result.rows[0].id;
}

async function getOrCreateSection(
  client: PoolClient,
  exhibitionId: number,
  section: (typeof sectionData)[number],
): Promise<number> {
  const result = await client.query<IdRow>(
    `INSERT INTO sections
       (exhibition_id, title, slug, introduction, section_order)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (exhibition_id, slug) DO UPDATE SET
       title = EXCLUDED.title,
       introduction = EXCLUDED.introduction,
       section_order = EXCLUDED.section_order,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
    [
      exhibitionId,
      section.title,
      section.slug,
      section.introduction,
      section.section_order,
    ],
  );
  return result.rows[0].id;
}

async function getOrCreatePerson(
  client: PoolClient,
  person: (typeof peopleData)[number],
): Promise<number> {
  const result = await client.query<IdRow>(
    `INSERT INTO people (name, slug, description, status, published_at)
     VALUES ($1, $2, $3, 'published', CURRENT_TIMESTAMP)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       description = COALESCE(people.description, EXCLUDED.description),
       status = 'published',
       published_at = COALESCE(people.published_at, CURRENT_TIMESTAMP),
       updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
    [
      person.name,
      person.slug,
      "description" in person ? person.description : null,
    ],
  );
  return result.rows[0].id;
}

async function getOrCreatePlace(
  client: PoolClient,
  name: string,
): Promise<number> {
  const existing = await client.query<IdRow>(
    `SELECT id FROM places WHERE LOWER(name) = LOWER($1) ORDER BY id LIMIT 1`,
    [name],
  );
  if (existing.rows[0]) {
    await client.query(
      `UPDATE places SET status = 'published',
         published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
         AND (status IS DISTINCT FROM 'published' OR published_at IS NULL)`,
      [existing.rows[0].id],
    );
    return existing.rows[0].id;
  }

  const result = await client.query<IdRow>(
    `INSERT INTO places (name, status, published_at)
     VALUES ($1, 'published', CURRENT_TIMESTAMP)
     RETURNING id`,
    [name],
  );
  return result.rows[0].id;
}

async function getOrCreateSource(
  client: PoolClient,
  source: (typeof sourceData)[number],
): Promise<number> {
  let existing = await client.query<IdRow>(
    "SELECT id FROM sources WHERE url = $1 ORDER BY id LIMIT 1",
    [source.url],
  );
  if (!existing.rows[0] && "legacy_url" in source) {
    existing = await client.query<IdRow>(
      "SELECT id FROM sources WHERE url = $1 ORDER BY id LIMIT 1",
      [source.legacy_url],
    );
  }

  if (!existing.rows[0]) {
    const created = await client.query<IdRow>(
      `INSERT INTO sources
         (title, author, publication, source_type, publication_date, url,
          citation, rights_statement, perspective_note)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8)
       RETURNING id`,
      [
        source.title,
        source.author,
        source.publication,
        source.source_type,
        source.publication_date,
        source.url,
        source.citation,
        source.perspective_note,
      ],
    );
    return created.rows[0].id;
  }

  await client.query(
    `UPDATE sources SET title = $1, author = $2, publication = $3,
       source_type = $4, publication_date = $5, url = $6, citation = $7,
       perspective_note = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9`,
    [
      source.title,
      source.author,
      source.publication,
      source.source_type,
      source.publication_date,
      source.url,
      source.citation,
      source.perspective_note,
      existing.rows[0].id,
    ],
  );
  return existing.rows[0].id;
}

async function getOrCreateArtifact(
  client: PoolClient,
  artifact: (typeof artifactData)[number],
  sectionIds: Map<string, number>,
  placeIds: Map<string, number>,
): Promise<number> {
  const existing = await client.query<IdRow>(
    "SELECT id FROM artifacts WHERE slug = $1",
    [artifact.slug],
  );
  const values = [
    artifact.title,
    artifact.slug,
    artifact.artifact_type,
    artifact.description,
    artifact.historical_context,
    artifact.date_display,
    artifact.place_key ? (placeIds.get(artifact.place_key) ?? null) : null,
    sectionIds.get(artifact.section_key) ?? null,
  ];

  if (!existing.rows[0]) {
    const created = await client.query<IdRow>(
      `INSERT INTO artifacts
         (title, slug, artifact_type, description, historical_context,
          date_display, place_id, section_id, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', CURRENT_TIMESTAMP)
       RETURNING id`,
      values,
    );
    return created.rows[0].id;
  }

  await client.query(
    `UPDATE artifacts SET title = $1, artifact_type = $3, description = $4,
       historical_context = $5, date_display = $6, place_id = $7,
       section_id = $8, status = 'published',
       published_at = ${publishedAt}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9 AND slug = $2`,
    [...values, existing.rows[0].id],
  );
  return existing.rows[0].id;
}

async function getOrCreateEvent(
  client: PoolClient,
  event: (typeof eventData)[number],
  sectionIds: Map<string, number>,
): Promise<number> {
  const existing = await client.query<IdRow>(
    "SELECT id FROM events WHERE slug = $1 ORDER BY id LIMIT 1",
    [event.slug],
  );
  const sectionId = sectionIds.get(event.section_key);
  if (!sectionId) throw new Error(`Missing section ${event.section_key}`);

  if (!existing.rows[0]) {
    const created = await client.query<IdRow>(
      `INSERT INTO events
         (section_id, title, slug, description, event_date, date_display,
          image_url, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, NULL, 'published', CURRENT_TIMESTAMP)
       RETURNING id`,
      [
        sectionId,
        event.title,
        event.slug,
        event.description,
        event.date,
        event.date_display,
      ],
    );
    return created.rows[0].id;
  }

  await client.query(
    `UPDATE events SET section_id = $1, title = $2, description = $4,
       event_date = $5, date_display = $6, status = 'published',
       image_url = NULL, published_at = ${publishedAt},
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $7 AND slug = $3`,
    [
      sectionId,
      event.title,
      event.slug,
      event.description,
      event.date,
      event.date_display,
      existing.rows[0].id,
    ],
  );
  return existing.rows[0].id;
}

async function upsertStory(
  client: PoolClient,
  sectionId: number,
): Promise<number> {
  const title = "Before Aburi";
  const slug = "before-aburi";
  const excerpt =
    "By late 1966, Nigeria was in crisis. Two coups, a counter-coup, and widespread violence had shattered trust between regions. The Supreme Military Council sought a final attempt at unity.";
  const content = `${excerpt}

January 15, 1966 - First military coup
July 29, 1966 - Counter-coup
Late 1966 - Widespread displacement of civil servants
December 1966 - The Supreme Military Council agrees to meet in Aburi.`;
  const existing = await client.query<IdRow>(
    "SELECT id FROM stories WHERE slug = $1",
    [slug],
  );

  if (!existing.rows[0]) {
    const created = await client.query<IdRow>(
      `INSERT INTO stories
         (section_id, title, slug, excerpt, content, cover_image_url,
          status, published_at)
       VALUES ($1, $2, $3, $4, $5, NULL, 'published', CURRENT_TIMESTAMP)
       RETURNING id`,
      [sectionId, title, slug, excerpt, content],
    );
    return created.rows[0].id;
  }

  await client.query(
    `UPDATE stories SET section_id = $1, title = $2, excerpt = $3,
       content = $4, cover_image_url = NULL, status = 'published',
       published_at = ${publishedAt}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 AND slug = $6`,
    [sectionId, title, excerpt, content, existing.rows[0].id, slug],
  );
  return existing.rows[0].id;
}

async function linkSource(
  client: PoolClient,
  sourceId: number,
  targetColumn:
    | "section_id"
    | "event_id"
    | "person_id"
    | "artifact_id"
    | "story_id"
    | "place_id",
  targetId: number,
  relationship: string,
  displayOrder: number,
): Promise<void> {
  const existing = await client.query<{ id: number }>(
    `SELECT id FROM source_links
     WHERE source_id = $1 AND ${targetColumn} = $2
     ORDER BY id LIMIT 1`,
    [sourceId, targetId],
  );
  if (existing.rows[0]) return;
  await client.query(
    `INSERT INTO source_links
       (source_id, ${targetColumn}, relationship, display_order)
     VALUES ($1, $2, $3, $4)`,
    [sourceId, targetId, relationship, displayOrder],
  );
}

async function main(): Promise<void> {
  await reportPotentialDuplicates();

  const client = await pool.connect();
  const sectionIds = new Map<string, number>();
  const personIds = new Map<string, number>();
  const placeIds = new Map<string, number>();
  const sourceIds = new Map<string, number>();
  const artifactIds = new Map<string, number>();
  const eventIds = new Map<string, number>();

  try {
    await client.query("BEGIN");
    const exhibitionId = await getOrCreateExhibition(client);

    for (const section of sectionData) {
      sectionIds.set(
        section.slug,
        await getOrCreateSection(client, exhibitionId, section),
      );
    }
    for (const person of peopleData) {
      personIds.set(person.slug, await getOrCreatePerson(client, person));
    }
    for (const placeName of placeNames) {
      placeIds.set(placeName, await getOrCreatePlace(client, placeName));
    }
    for (const source of sourceData) {
      sourceIds.set(source.key, await getOrCreateSource(client, source));
    }
    for (const artifact of artifactData) {
      artifactIds.set(
        artifact.slug,
        await getOrCreateArtifact(client, artifact, sectionIds, placeIds),
      );
    }
    for (const event of eventData) {
      eventIds.set(
        event.slug,
        await getOrCreateEvent(client, event, sectionIds),
      );
    }

    const beforeAburiSectionId = sectionIds.get("before-aburi");
    if (!beforeAburiSectionId) throw new Error("Missing Before Aburi section");
    const beforeAburiStoryId = await upsertStory(client, beforeAburiSectionId);

    for (const [sectionSlug, people] of Object.entries(sectionPeople)) {
      const sectionId = sectionIds.get(sectionSlug);
      if (!sectionId) throw new Error(`Missing section ${sectionSlug}`);
      for (const [displayOrder, personSlug] of people.entries()) {
        const personId = personIds.get(personSlug);
        if (!personId) throw new Error(`Missing person ${personSlug}`);
        await client.query(
          `INSERT INTO section_people (section_id, person_id, display_order)
           VALUES ($1, $2, $3)
           ON CONFLICT (section_id, person_id) DO NOTHING`,
          [sectionId, personId, displayOrder + 1],
        );
      }
    }

    for (const [sectionSlug, places] of Object.entries(sectionPlaces)) {
      const sectionId = sectionIds.get(sectionSlug);
      if (!sectionId) throw new Error(`Missing section ${sectionSlug}`);
      for (const [displayOrder, placeName] of places.entries()) {
        const placeId = placeIds.get(placeName);
        if (!placeId) throw new Error(`Missing place ${placeName}`);
        await client.query(
          `INSERT INTO section_places (section_id, place_id, display_order)
           VALUES ($1, $2, $3)
           ON CONFLICT (section_id, place_id) DO NOTHING`,
          [sectionId, placeId, displayOrder + 1],
        );
      }
    }

    for (const event of eventData) {
      const eventId = eventIds.get(event.slug);
      if (!eventId) throw new Error(`Missing event ${event.slug}`);
      for (const personSlug of event.people) {
        const personId = personIds.get(personSlug);
        if (!personId) throw new Error(`Missing person ${personSlug}`);
        await client.query(
          `INSERT INTO event_people (event_id, person_id)
           VALUES ($1, $2)
           ON CONFLICT (event_id, person_id) DO NOTHING`,
          [eventId, personId],
        );
      }
      for (const placeName of event.places) {
        const placeId = placeIds.get(placeName);
        if (!placeId) throw new Error(`Missing place ${placeName}`);
        await client.query(
          `INSERT INTO event_places (event_id, place_id)
           VALUES ($1, $2)
           ON CONFLICT (event_id, place_id) DO NOTHING`,
          [eventId, placeId],
        );
      }
      for (const sourceKey of event.source_keys) {
        const sourceId = sourceIds.get(sourceKey);
        if (!sourceId) throw new Error(`Missing source ${sourceKey}`);
        await linkSource(
          client,
          sourceId,
          "event_id",
          eventId,
          "Associated source",
          1,
        );
      }
    }

    const sourceSectionLinks: Array<[string, string[]]> = [
      ["the-meeting", ["S3"]],
      ["after-aburi", ["S1", "S2", "S4", "S7"]],
      ["road-to-war", ["S5", "S6", "S6b"]],
      ["what-remains", ["S1", "S2", "S3", "S4", "S5", "S6", "S6b", "S7"]],
    ];
    for (const [sectionSlug, sourceKeys] of sourceSectionLinks) {
      const sectionId = sectionIds.get(sectionSlug);
      if (!sectionId) throw new Error(`Missing section ${sectionSlug}`);
      for (const [displayOrder, sourceKey] of sourceKeys.entries()) {
        const sourceId = sourceIds.get(sourceKey);
        if (!sourceId) throw new Error(`Missing source ${sourceKey}`);
        await linkSource(
          client,
          sourceId,
          "section_id",
          sectionId,
          sectionSlug === "what-remains"
            ? "See the Evidence collection"
            : "Associated section source",
          displayOrder + 1,
        );
      }
    }

    for (const artifact of artifactData) {
      const artifactId = artifactIds.get(artifact.slug);
      if (!artifactId) throw new Error(`Missing artifact ${artifact.slug}`);
      for (const [displayOrder, sourceKey] of artifact.source_keys.entries()) {
        const source = SOURCE_BY_KEY.get(sourceKey);
        if (!source) throw new Error(`Missing source for ${artifact.slug}`);
        const sourceId = sourceIds.get(source.key);
        if (!sourceId) throw new Error(`Missing source ${source.key}`);
        await linkSource(
          client,
          sourceId,
          "artifact_id",
          artifactId,
          "Source for document",
          displayOrder + 1,
        );
      }
    }

    await client.query("COMMIT");
    console.log(`Aburi seed completed for exhibition ${exhibitionId}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Aburi seed failed; transaction rolled back.", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

void main();
