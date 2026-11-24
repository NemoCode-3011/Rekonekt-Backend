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

// The one place that decides the frontend URL (CORS, email links).
// In production CLIENT_URL must be set, so a missing value fails
// at startup instead of silently pointing somewhere else.
export const getClientUrl = () => {
  const raw = process.env.CLIENT_URL;

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CLIENT_URL must be set in production.");
    }
    return normalizeClientOrigin("http://localhost:5173");
  }

  return normalizeClientOrigin(raw);
};