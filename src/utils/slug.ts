// "Ilé-Ifẹ̀ & the Ooni's Palace" -> "ile-ife-and-the-oonis-palace"
// Accents are dropped, so Yoruba, Igbo and Hausa names turn into clean web addresses.
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200)
    .replace(/-+$/g, "");