import React from "react";
import { getCoverImageUrl } from "../services/mangaService";
import "./MangaList.css";

const MangaList = ({ mangas, onMangaClick }) => (
  <div className="manga-list">
    {mangas.map((manga) => (
      <div
        key={manga.id}
        className="manga-card"
        onClick={() => onMangaClick(manga.id)}
      >
        <img
          src={
            manga.relationships.find((rel) => rel.type === "cover_art")
              ?.attributes?.fileName
              ? `https://uploads.mangadex.org/covers/${manga.id}/${
                  manga.relationships.find((rel) => rel.type === "cover_art")
                    ?.attributes?.fileName
                }`
              : "https://via.placeholder.com/150"
          }
          alt={manga.attributes.title.en || "Manga Cover"}
        />
        <p>{manga.attributes.title.en || "Unknown Title"}</p>
      </div>
    ))}
  </div>
);

export default MangaList;
