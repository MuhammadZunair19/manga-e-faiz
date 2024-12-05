import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animeAnimation from "../components/Anime.json";

import "./LandingPage.css"; // CSS for styling

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="animation-wrapper">
        <Player
          autoplay
          loop
          src={animeAnimation} // Use the imported JSON animation
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="overlay">
        <h1 className="landing-title">Welcome to MangaVerse</h1>
        <p className="landing-subtitle">
          Your ultimate manga reading experience
        </p>
        <div className="button-group">
          <button className="landing-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="landing-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
