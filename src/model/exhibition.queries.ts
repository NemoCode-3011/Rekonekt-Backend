export const getPublishedExhibitionsQuery = `
  SELECT
    id,
    title,
    slug,
    subtitle,
    description,
    start_date,
    end_date,
    cover_image_url,
    published_at
  FROM exhibitions
  WHERE status = 'published'
  ORDER BY published_at DESC;
`;
