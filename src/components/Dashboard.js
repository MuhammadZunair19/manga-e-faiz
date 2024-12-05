import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; // Custom styles for dashboard

const Dashboard = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [library, setLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibrary, setFilteredLibrary] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRecentlyViewed(response.data.recentlyViewed);
        setFavorites(response.data.favorites);
        setLibrary(response.data.library);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  // Handle search
  const handleSearch = () => {
    const filtered = library.filter((manga) =>
      manga.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLibrary(filtered);
  };

  return (
    <div className="dashboard-container">
      <h1>Your Manga Dashboard</h1>

      <div className="section">
        <h2>Recently Viewed</h2>
        <ul>
          {recentlyViewed.map((manga) => (
            <li key={manga.id}>{manga.title}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Favorites</h2>
        <ul>
          {favorites.map((manga) => (
            <li key={manga.id}>{manga.title}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Your Library</h2>
        <div>
          <input
            type="text"
            placeholder="Search manga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul>
          {filteredLibrary.length > 0
            ? filteredLibrary.map((manga) => (
                <li key={manga.id}>{manga.title}</li>
              ))
            : library.map((manga) => <li key={manga.id}>{manga.title}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
