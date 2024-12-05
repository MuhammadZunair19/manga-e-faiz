import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FilterComponent.css";

const FilterComponent = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  // Fetch genres and authors on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const genreResponse = await axios.get(
          "https://api.mangadex.org/manga/tag"
        );
        const authorResponse = await axios.get(
          "https://api.mangadex.org/author"
        );

        setGenres(genreResponse.data.data || []);
        setAuthors(authorResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching genres or authors:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    onFilterChange({ genre: e.target.value, author: selectedAuthor });
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
    onFilterChange({ genre: selectedGenre, author: e.target.value });
  };

  return (
    <div className="filter-component">
      <h3>Filter Manga</h3>
      <div className="filter-dropdown">
        <label htmlFor="genre-select">Genre:</label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.attributes.name.en}>
              {genre.attributes.name.en}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-dropdown">
        <label htmlFor="author-select">Author:</label>
        <select
          id="author-select"
          value={selectedAuthor}
          onChange={handleAuthorChange}
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author.id} value={author.attributes.name}>
              {author.attributes.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;
