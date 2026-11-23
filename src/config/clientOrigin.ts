export const normalizeClientOrigin = (clientUrl: string) => {
  let url: URL;

  try {
    url = new URL(clientUrl);
  } catch {
    throw new Error("CLIENT_URL must be an absolute HTTP or HTTPS URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("CLIENT_URL must be an absolute HTTP or HTTPS URL.");
  }

  return url.origin;
};
