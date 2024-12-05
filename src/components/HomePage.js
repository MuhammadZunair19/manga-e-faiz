import React, { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";
import FilterComponenthp from "./FilterComponenthp";
import MangaList from "./MangaList";
import MostViewedMangas from "./MostViewedMangas";
import RecentlyUploadedMangas from "./RecentlyUploadedMangas";
import RecentlyUpdatedMangas from "./RecentlyUpdatedMangas";
import "./Homepage.css";
import AIChatbot from "./AIChatbot";
import axios from "axios";
import MangaOverview from "./MangaOverview";

const Homepage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [selectedMangaId, setSelectedMangaId] = useState(null);

  const handleFilterChange = (filters) => {
    const results = searchResults.filter((manga) => {
      const matchesGenre =
        filters.genre === "" ||
        manga.attributes.tags.some((tag) =>
          tag.attributes.name.en
            .toLowerCase()
            .includes(filters.genre.toLowerCase())
        );
      const matchesAuthor =
        filters.author === "" ||
        manga.attributes.author
          ?.toLowerCase()
          .includes(filters.author.toLowerCase());
      const matchesYear =
        filters.year === "" || manga.attributes.year === Number(filters.year);

      return matchesGenre && matchesAuthor && matchesYear;
    });

    setFilteredResults(results);
  };

  // Fetch Manga List for Homepage
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await axios.get("https://api.mangadex.org/manga", {
          params: {
            limit: 12,
            includes: ["cover_art"],
            order: { rating: "desc" }, // Fetch top-rated mangas
          },
        });
        setMangas(response.data.data);
      } catch (error) {
        console.error("Error fetching manga list:", error);
      }
    };

    fetchMangas();
  }, []);

  const openMangaOverview = (mangaId) => {
    setSelectedMangaId(mangaId);
  };

  const closeMangaOverview = () => {
    setSelectedMangaId(null);
  };

  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="logo">Manga Haven</div>
        <SearchComponent onSearchResults={setSearchResults} />
      </header>

      <main className="content">
        {!selectedMangaId ? (
          <>
            <FilterComponenthp onFilterChange={handleFilterChange} />

            {filteredResults.length > 0 ? (
              <MangaList
                mangas={filteredResults}
                onMangaClick={openMangaOverview}
              />
            ) : searchResults.length > 0 ? (
              <MangaList
                mangas={searchResults}
                onMangaClick={openMangaOverview}
              />
            ) : (
              <>
                <MostViewedMangas onMangaClick={openMangaOverview} />
                <RecentlyUploadedMangas onMangaClick={openMangaOverview} />
                <RecentlyUpdatedMangas onMangaClick={openMangaOverview} />
              </>
            )}

            <AIChatbot />
          </>
        ) : (
          <MangaOverview
            mangaId={selectedMangaId}
            onClose={closeMangaOverview}
          />
        )}
      </main>
    </div>
  );
};

export default Homepage;
