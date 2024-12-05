import React, { useEffect, useState } from "react";
import {
  fetchRecentlyUpdatedMangas,
  getCoverImageUrl,
} from "../services/mangaService";
import "./RecentlyUpdatedMangas.css";

const RecentlyUpdatedMangas = () => {
  const [recentlyUpdated, setRecentlyUpdated] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangas = await fetchRecentlyUpdatedMangas();
        setRecentlyUpdated(mangas);
      } catch (error) {
        console.error("Error fetching recently updated mangas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="recently-updated-container">
      <h2>Recently Updated Mangas</h2>
      <div className="manga-grid">
        {recentlyUpdated.map((manga) => (
          <div key={manga.id} className="manga-card">
            <img
              src={getCoverImageUrl(manga) || "https://via.placeholder.com/150"}
              alt={manga.attributes.title.en || "Manga Cover"}
            />
            <h3>{manga.attributes.title.en || "Unknown Title"}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyUpdatedMangas;
