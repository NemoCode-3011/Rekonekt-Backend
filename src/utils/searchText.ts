const HAUSA: Record<string, string> = { ɓ: "b", ɗ: "d", ƙ: "k", ƴ: "y" };

// Same rule as the frontend, so a typed term matches the folded columns.
export const foldText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[ɓɗƙƴ]/g, (letter) => HAUSA[letter]);