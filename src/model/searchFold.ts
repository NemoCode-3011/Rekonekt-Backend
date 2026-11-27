// The same folding, done to a column inside Postgres (needs Postgres 13+).
export const foldSql = (expr: string) =>
  `translate(lower(regexp_replace(normalize(${expr}, NFD), '[\\u0300-\\u036f]', '', 'g')), 'ɓɗƙƴ', 'bdky')`;