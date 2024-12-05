import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProgressTracker.css";

const ProgressTracker = ({
  mangaId,
  totalChapters,
  existingProgress,
  onProgressUpdate,
}) => {
  const [progress, setProgress] = useState(existingProgress || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setProgress(existingProgress || 0);
  }, [existingProgress]);

  const handleProgressChange = (newProgress) => {
    if (newProgress < 0 || newProgress > totalChapters) {
      alert("Progress must be between 0 and the total number of chapters.");
      return;
    }
    setProgress(newProgress);
  };

  const saveProgress = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/progress",
        { mangaId, progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Progress updated successfully!");
      if (onProgressUpdate) onProgressUpdate(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Failed to update progress.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="progress-tracker">
      <h3>Progress Tracker</h3>
      <p>
        Total Chapters: <strong>{totalChapters}</strong>
      </p>
      <div className="progress-input">
        <input
          type="number"
          value={progress}
          onChange={(e) => handleProgressChange(Number(e.target.value))}
        />
        <button onClick={saveProgress} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Progress"}
        </button>
      </div>
      <p>
        Current Progress:{" "}
        <strong>
          {progress} / {totalChapters}
        </strong>
      </p>
    </div>
  );
};

export default ProgressTracker;
