import { pool } from "../database/db";
import * as queries from "../model/contentRelationships.queries";
import type { SourceTargetType } from "../model/contentRelationships.queries";
import type { SectionPerson, SectionPlace } from "../types/contentRelationships";

export const createSectionPerson = async (
  sectionId: number,
  personId: number,
  displayOrder: number,
) => {
  const result = await pool.query<SectionPerson>(
    queries.createSectionPersonQuery,
    [sectionId, personId, displayOrder],
  );
  return result.rows[0];
};

export const getSectionPeople = async (sectionId: number, admin = false) => {
  const query = admin
    ? queries.getAdminSectionPeopleQuery
    : queries.getSectionPeopleQuery;
  const result = await pool.query(query, [sectionId]);
  return result.rows;
};

export const deleteSectionPerson = async (
  sectionId: number,
  personId: number,
) => {
  const result = await pool.query<SectionPerson>(
    queries.deleteSectionPersonQuery,
    [sectionId, personId],
  );
  return result.rows[0];
};

export const createSectionPlace = async (
  sectionId: number,
  placeId: number,
  displayOrder: number,
) => {
  const result = await pool.query<SectionPlace>(
    queries.createSectionPlaceQuery,
    [sectionId, placeId, displayOrder],
  );
  return result.rows[0];
};

export const getSectionPlaces = async (sectionId: number, admin = false) => {
  const query = admin
    ? queries.getAdminSectionPlacesQuery
    : queries.getSectionPlacesQuery;
  const result = await pool.query(query, [sectionId]);
  return result.rows;
};

export const deleteSectionPlace = async (
  sectionId: number,
  placeId: number,
) => {
  const result = await pool.query<SectionPlace>(
    queries.deleteSectionPlaceQuery,
    [sectionId, placeId],
  );
  return result.rows[0];
};

export const getSourcesForContent = async (
  targetType: SourceTargetType,
  targetId: number,
) => {
  const result = await pool.query(
    queries.getSourcesForContentQuery(targetType),
    [targetId],
  );
  return result.rows;
};
