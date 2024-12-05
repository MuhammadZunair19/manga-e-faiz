import React, { useState } from "react";
import "./FilterComponenthp.css";

const FilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    year: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="filter-container">
      <h3>Filter Mangas</h3>
      <div className="filter-group">
        <label>Genre:</label>
        <input
          type="text"
          name="genre"
          placeholder="e.g., Action, Romance"
          value={filters.genre}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-group">
        <label>Author:</label>
        <input
          type="text"
          name="author"
          placeholder="e.g., Akira Toriyama"
          value={filters.author}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-group">
        <label>Year:</label>
        <input
          type="number"
          name="year"
          placeholder="e.g., 2021"
          value={filters.year}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterComponent;
