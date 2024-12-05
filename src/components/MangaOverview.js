import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MangaOverview.css";

const MangaOverview = ({ mangaId, onClose }) => {
  const [mangaDetails, setMangaDetails] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [similarMangas, setSimilarMangas] = useState([]);
  const [rating, setRating] = useState(null);
  const [forumLink, setForumLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch manga details
  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.mangadex.org/manga/${mangaId}`,
          { params: { includes: ["author", "artist", "cover_art"] } }
        );
        setMangaDetails(response.data.data);

        // Fetch chapters
        const chapterResponse = await axios.get(
          `https://api.mangadex.org/chapter`,
          {
            params: {
              manga: mangaId,
              limit: 10,
              translatedLanguage: ["en"],
            },
          }
        );
        setChapters(chapterResponse.data.data);

        // Fetch similar mangas
        const similarResponse = await axios.get(
          `https://api.mangadex.org/manga`,
          {
            params: {
              limit: 5,
              genres: response.data.data.attributes.tags
                .slice(0, 1)
                .map((tag) => tag.attributes.name.en),
            },
          }
        );
        setSimilarMangas(similarResponse.data.data);

        // Fetch rating from MyAnimeList
        const malResponse = await axios.get(
          `https://api.jikan.moe/v4/manga?q=${response.data.data.attributes.title.en}`
        );
        if (malResponse.data.data && malResponse.data.data.length > 0) {
          setRating(malResponse.data.data[0].score);
        }

        // Forum discussion link
        setForumLink(
          `https://myanimelist.net/manga/${malResponse.data.data[0].mal_id}/forum`
        );
      } catch (error) {
        console.error("Error fetching manga overview data:", error);
      }
    };

    fetchMangaDetails();
  }, [mangaId]);
  if (loading) return <div>Loading manga details...</div>;
  if (error) return <div>{error}</div>;
  const { attributes } = mangaDetails || {};
  const title = attributes?.title?.en || "Unknown Title";
  const description =
    attributes?.description?.en || "No description available.";
  const genres = attributes?.tags?.map(
    (tag) => tag?.attributes?.name?.en || "Unknown Genre"
  );
  const author =
    mangaDetails.relationships?.find((rel) => rel.type === "author")?.attributes
      ?.name || "Unknown Author";

  return (
    <div className="manga-overview-container">
      <button onClick={onClose} className="back-button">
        Back to List
      </button>
      {mangaDetails && (
        <>
          <h1>{mangaDetails.attributes.title.en || "Unknown Title"}</h1>
          <p>
            <strong>Summary:</strong>{" "}
            {mangaDetails.attributes.description.en ||
              "No description available"}
          </p>
          <p>
            <strong>Author:</strong>{" "}
            {mangaDetails.relationships
              .filter((rel) => rel.type === "author")
              .map((author) => author.attributes.name)
              .join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Rating:</strong> {rating || "Not available"} (from
            MyAnimeList)
          </p>

          <h3>Chapters</h3>
          <ul>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`https://mangadex.org/chapter/${chapter.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chapter.attributes.title ||
                    `Chapter ${chapter.attributes.chapter}`}
                </a>
              </li>
            ))}
          </ul>

          <h3>Similar Mangas</h3>
          <div className="similar-mangas">
            {similarMangas.map((manga) => (
              <div key={manga.id} className="manga-card">
                <img
                  src={`https://uploads.mangadex.org/covers/${manga.id}/${manga.attributes.title.en}.jpg`}
                  alt={manga.attributes.title.en}
                />
                <p>{manga.attributes.title.en || "Unknown Title"}</p>
              </div>
            ))}
          </div>

          <h3>Forum Discussion</h3>
          {forumLink ? (
            <a href={forumLink} target="_blank" rel="noopener noreferrer">
              Join the discussion on MyAnimeList
            </a>
          ) : (
            <p>No forum discussion available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MangaOverview;
