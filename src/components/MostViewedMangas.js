import React, { useEffect, useState } from "react";
import {
  fetchMostViewedMangas,
  getCoverImageUrl,
} from "../services/mangaService";
import "./MostViewedMangas.css";

const MostViewedMangas = ({ onMangaClick }) => {
  const [mostViewedMangas, setMostViewedMangas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangas = await fetchMostViewedMangas();
        setMostViewedMangas(mangas);
      } catch (error) {
        console.error("Error fetching most viewed mangas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="most-viewed-container">
      <h2>Most Viewed Mangas</h2>
      <div className="manga-grid">
        {mostViewedMangas.map((manga) => (
          <div
            key={manga.id}
            className="manga-card"
            onClick={() => onMangaClick(manga.id)} // Trigger the onMangaClick function
          >
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

export default MostViewedMangas;
