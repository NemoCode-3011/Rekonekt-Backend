export const getCulturalGroupsQuery = `
  SELECT id, name, language, region
  FROM cultural_groups
  ORDER BY name ASC;
`;