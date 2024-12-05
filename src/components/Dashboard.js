import React, { useState, useEffect } from "react";
import { searchManga, getCoverImageUrl } from "../services/mangadexService";
import RatingAndReview from "./RatingAndReview"; // Import RatingAndReview component
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mangaResults, setMangaResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [mangaDetails, setMangaDetails] = useState(null);
  const [userReview, setUserReview] = useState({ rating: 0, review: "" });

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFavorites(response.data.favorites || []);
        setLibrary(response.data.library || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to fetch dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  // Search Manga
  const handleSearch = async () => {
    try {
      const results = await searchManga(searchTerm);
      setMangaResults(results);
    } catch (error) {
      console.error("Error searching manga:", error);
      alert("Failed to fetch manga data. Please try again.");
    }
  };

  // Open Manga Details Modal
  const openMangaDetails = async (mangaId) => {
    try {
      const detailsResponse = await axios.get(
        `https://api.mangadex.org/manga/${mangaId}`
      );
      setMangaDetails(detailsResponse.data.data);

      try {
        const reviewResponse = await axios.get(
          `http://localhost:5000/api/users/review/${mangaId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserReview(reviewResponse.data || { rating: 0, review: "" });
      } catch (reviewError) {
        console.error("No review found:", reviewError);
        setUserReview({ rating: 0, review: "" }); // Default empty review
      }

      setSelectedManga(mangaId);
    } catch (error) {
      console.error("Error fetching manga details or user review:", error);
      alert("Failed to fetch manga details.");
    }
  };

  // Close Manga Details Modal
  const closeMangaDetails = () => {
    setSelectedManga(null);
    setMangaDetails(null);
    setUserReview({ rating: 0, review: "" });
  };

  // Add Manga to Favorites
  const handleAddToFavorites = async (manga) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/favorites",
        { mangaId: manga.id, title: manga.attributes.title.en },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Favorites");
      setFavorites((prev) => [...prev, manga]);
    } catch (error) {
      console.error("Error adding manga to favorites:", error);
      alert("Failed to add manga to favorites.");
    }
  };

  // Add Manga to Library
  const handleAddToLibrary = async (manga) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/library",
        { mangaId: manga.id, title: manga.attributes.title.en },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Library");
      setLibrary((prev) => [...prev, manga]);
    } catch (error) {
      console.error("Error adding manga to library:", error);
      alert("Failed to add manga to library.");
    }
  };

  // Remove Manga from Favorites
  const handleRemoveFromFavorites = async (mangaId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/users/favorites/${mangaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Removed from Favorites");
      setFavorites((prev) => prev.filter((manga) => manga.id !== mangaId));
    } catch (error) {
      console.error("Error removing manga from favorites:", error);
      alert("Failed to remove manga from favorites.");
    }
  };

  // Remove Manga from Library
  const handleRemoveFromLibrary = async (mangaId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/library/${mangaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Removed from Library");
      setLibrary((prev) => prev.filter((manga) => manga.id !== mangaId));
    } catch (error) {
      console.error("Error removing manga from library:", error);
      alert("Failed to remove manga from library.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Manga Dashboard</h1>

      {/* Search Section */}
      <div className="section">
        <h2>Search Manga</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for manga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="manga-results">
          {mangaResults.map((manga) => (
            <div
              key={manga.id}
              className="manga-card"
              onClick={() => openMangaDetails(manga.id)}
            >
              <img
                src={
                  getCoverImageUrl(manga) || "https://via.placeholder.com/150"
                }
                alt={manga.attributes.title.en || "Manga Cover"}
              />
              <h3>{manga.attributes.title.en || "Unknown Title"}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Manga Details Modal */}
      {selectedManga && mangaDetails && (
        <div className="manga-modal">
          <h2>{mangaDetails.attributes.title.en || "No Title Available"}</h2>
          <p>
            {mangaDetails.attributes.description?.en ||
              "No description available"}
          </p>
          <RatingAndReview
            mangaId={selectedManga}
            existingRating={userReview.rating}
            existingReview={userReview.review}
            onReviewSubmitted={(newReview) => setUserReview(newReview)}
          />
          <button onClick={() => handleAddToFavorites(mangaDetails)}>
            Add to Favorites
          </button>
          <button onClick={() => handleAddToLibrary(mangaDetails)}>
            Add to Library
          </button>
          <button onClick={() => handleRemoveFromFavorites(selectedManga)}>
            Remove from Favorites
          </button>
          <button onClick={() => handleRemoveFromLibrary(selectedManga)}>
            Remove from Library
          </button>
          <button onClick={closeMangaDetails} className="close-modal-button">
            Close
          </button>
        </div>
      )}

      {/* Favorites Section */}
      <div className="section">
        <h2>Favorites</h2>
        <div className="manga-list">
          {favorites.map((manga) => (
            <div key={manga.id} className="manga-item">
              <img src={getCoverImageUrl(manga)} alt={manga.title} />
              <p>{manga.title}</p>
              <button onClick={() => handleRemoveFromFavorites(manga.id)}>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Library Section */}
      <div className="section">
        <h2>Your Library</h2>
        <div className="manga-list">
          {library.map((manga) => (
            <div key={manga.id} className="manga-item">
              <img src={getCoverImageUrl(manga)} alt={manga.title} />
              <p>{manga.title}</p>
              <button onClick={() => handleRemoveFromLibrary(manga.id)}>
                Remove from Library
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
