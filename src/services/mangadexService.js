import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

// Fetch manga by title
export const searchManga = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title,
        limit: 10,
        includes: ["cover_art"], // Include cover art in relationships
      },
    });
    return response.data.data; // Manga array
  } catch (error) {
    console.error("Error fetching manga:", error);
    throw error;
  }
};

// Generate cover image URL
export const getCoverImageUrl = (manga) => {
  if (!manga || !manga.relationships) return null; // Return null if manga or relationships are undefined

  const coverRel = manga.relationships.find((rel) => rel.type === "cover_art");
  if (!coverRel || !coverRel.attributes || !coverRel.attributes.fileName)
    return null;

  const mangaId = manga.id;
  const fileName = coverRel.attributes.fileName;

  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
};
