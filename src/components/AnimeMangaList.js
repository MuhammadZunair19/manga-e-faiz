// src/components/AnimeMangaList.js
import React, { useState, useEffect } from "react";
import { fetchAnimeManga, getCoverImageUrl } from "../services/mangaService";
import "./AnimeMangaList.css";

const AnimeMangaList = () => {
  const [animeMangaList, setAnimeMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await fetchAnimeManga();
        setAnimeMangaList(list);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch anime/manga list.");
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  if (loading) return <div className="loading">Loading anime/manga...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="anime-manga-container">
      <h1>Anime/Manga List</h1>
      <ul className="anime-manga-list">
        {animeMangaList.map((manga) => (
          <li key={manga.id} className="anime-manga-item">
            <img
              src={getCoverImageUrl(manga) || "https://via.placeholder.com/150"}
              alt={manga.attributes.title.en || "Manga Cover"}
            />
            <div className="anime-manga-info">
              <h3>{manga.attributes.title.en || "Unknown Title"}</h3>
              <p>
                {manga.attributes.description?.en?.substring(0, 100) ||
                  "No description available"}
                ...
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimeMangaList;
