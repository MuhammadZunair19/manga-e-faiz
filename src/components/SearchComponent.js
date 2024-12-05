import React, { useState } from "react";
import { searchManga, getCoverImageUrl } from "../services/mangaService";
import "./SearchComponent.css";

const SearchComponent = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await searchManga(searchTerm);
      onSearchResults(results);
    } catch (error) {
      console.error("Error searching mangas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a manga..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchComponent;
