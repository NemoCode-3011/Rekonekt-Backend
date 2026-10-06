import type { QueryResultRow } from "pg";

export interface SourceLink extends QueryResultRow {
  id: number;
  source_id: number;
  section_id: number | null;
  event_id: number | null;
  person_id: number | null;
  artifact_id: number | null;
  story_id: number | null;
  place_id: number | null;
  relationship: string | null;
  display_order: number | null;
  created_at: Date;
}

export interface SectionPerson extends QueryResultRow {
  section_id: number;
  person_id: number;
  display_order: number;
}

export interface SectionPlace extends QueryResultRow {
  section_id: number;
  place_id: number;
  display_order: number;
}
