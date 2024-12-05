import React from "react";
import "./ShareManga.css";

const ShareManga = ({ manga }) => {
  const shareManga = () => {
    const shareableLink = `https://mangadex.org/title/${manga.id}`;

    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: manga.attributes.title.en || "Check out this manga!",
          text:
            manga.attributes.description?.en ||
            "Explore this manga on MangaDex!",
          url: shareableLink,
        })
        .then(() => console.log("Manga shared successfully!"))
        .catch((error) => console.error("Error sharing manga:", error));
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(shareableLink).then(
        () => {
          alert("Link copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy link:", err);
        }
      );
    }
  };

  return (
    <div className="share-manga-container">
      <button onClick={shareManga} className="share-button">
        Share Manga
      </button>
    </div>
  );
};

export default ShareManga;
