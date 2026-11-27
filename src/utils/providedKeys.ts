export const providedKeys = (data: object) =>
  Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => key);