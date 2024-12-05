import axios from "axios";

// Fetch Most Viewed Mangas
export const fetchMostViewedMangas = async () => {
  const response = await axios.get("https://api.mangadex.org/manga", {
    params: {
      includes: ["cover_art"],
      order: { views: "desc" },
      limit: 10,
    },
  });
  return response.data.data;
};

// Fetch Recently Uploaded Mangas
export const fetchRecentlyUploadedMangas = async () => {
  const response = await axios.get("https://api.mangadex.org/manga", {
    params: {
      includes: ["cover_art"],
      order: { createdAt: "desc" },
      limit: 10,
    },
  });
  return response.data.data;
};

// Fetch Recently Updated Mangas
export const fetchRecentlyUpdatedMangas = async () => {
  const response = await axios.get("https://api.mangadex.org/manga", {
    params: {
      includes: ["cover_art"],
      order: { updatedAt: "desc" },
      limit: 10,
    },
  });
  return response.data.data;
};

// Get Cover Image URL
export const getCoverImageUrl = (manga) => {
  const coverArt = manga.relationships.find((rel) => rel.type === "cover_art");
  return coverArt
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
    : null;
};

// Search Manga by Title
export const searchManga = async (title) => {
  const response = await axios.get("https://api.mangadex.org/manga", {
    params: {
      title,
      includes: ["cover_art"],
      limit: 10,
    },
  });
  return response.data.data;
};
