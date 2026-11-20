export type YouTubeVideoSource = {
  videoId: string;
  canonicalUrl: string;
  embedUrl: string;
};

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export const parseYouTubeVideoUrl = (
  value: string,
): YouTubeVideoSource | null => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }

    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      const pathSegments = url.pathname.split("/").filter(Boolean);
      videoId = pathSegments.length === 1 ? pathSegments[0] : null;
    } else if (
      ["youtube.com", "m.youtube.com", "music.youtube.com"].includes(hostname)
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        videoId =
          url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)\/?$/)?.[1] ??
          null;
      }
    } else if (hostname === "youtube-nocookie.com") {
      videoId = url.pathname.match(/^\/embed\/([^/]+)\/?$/)?.[1] ?? null;
    }

    if (!videoId || !YOUTUBE_VIDEO_ID.test(videoId)) {
      return null;
    }

    return {
      videoId,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    };
  } catch {
    return null;
  }
};
