const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Favorites = require("../models/Favorites");
const RecentlyViewed = require("../models/RecentlyViewed");
const Library = require("../models/Library");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "helloworld"; // Use environment variable or default value

// Registration Endpoint
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in /login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Route: Fetch dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the auth middleware

    const recentlyViewed = await RecentlyViewed.find({ userId }).limit(5);
    const favorites = await Favorites.find({ userId });
    const library = await Library.find({ userId });

    res.json({ recentlyViewed, favorites, library });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// Protected Route: Add to favorites
router.post("/favorites", authMiddleware, async (req, res) => {
  const { mangaId, title } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Favorites.findOne({ userId, mangaId });
    if (existing) {
      return res.status(400).json({ message: "Manga already in favorites" });
    }

    const newFavorite = new Favorites({ userId, mangaId, title });
    await newFavorite.save();

    res.status(201).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Error adding to favorites" });
  }
});

// Add to library
router.post("/library", authMiddleware, async (req, res) => {
  const { mangaId, title } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Library.findOne({ userId, mangaId });
    if (existing) {
      return res.status(400).json({ message: "Manga already in library" });
    }

    const newLibraryItem = new Library({ userId, mangaId, title });
    await newLibraryItem.save();

    res.status(201).json({ message: "Added to library" });
  } catch (error) {
    console.error("Error adding to library:", error);
    res.status(500).json({ message: "Error adding to library" });
  }
});

router.delete("/favorites/:mangaId", authMiddleware, async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  console.log("Favorites Deletion Request:", { userId, mangaId });

  try {
    const result = await Favorites.deleteOne({ userId, mangaId });
    console.log("Deletion Result:", result);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Manga not found in favorites" });
    }
    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Failed to remove from favorites" });
  }
});

router.delete("/library/:mangaId", authMiddleware, async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  console.log("Library Deletion Request:", { userId, mangaId });

  try {
    const result = await Library.deleteOne({ userId, mangaId });
    console.log("Deletion Result:", result);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Manga not found in library" });
    }
    res.status(200).json({ message: "Removed from library" });
  } catch (error) {
    console.error("Error removing from library:", error);
    res.status(500).json({ message: "Failed to remove from library" });
  }
});

router.put("/library/progress", authMiddleware, async (req, res) => {
  const { mangaId, progress } = req.body;
  const userId = req.user.id;

  try {
    const result = await Library.updateOne(
      { userId, _id: mangaId },
      { $set: { progress } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Manga not found in library" });
    }

    res.status(200).json({ message: "Progress updated" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
});
router.post("/reviews", authMiddleware, async (req, res) => {
  const { mangaId, review, rating } = req.body;
  const userId = req.user.id;

  try {
    const result = await Library.updateOne(
      { userId, _id: mangaId },
      { $set: { review, rating } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Manga not found in library" });
    }

    res.status(200).json({ message: "Review submitted" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

router.post("/review", authMiddleware, async (req, res) => {
  const { mangaId, rating, review } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const existingReview = user.reviews.find((r) => r.mangaId === mangaId);

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;
    } else {
      user.reviews.push({ mangaId, rating, review });
    }

    await user.save();
    res.status(200).json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Failed to save review" });
  }
});

// Get review for a manga
router.get("/review/:mangaId", authMiddleware, async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the review for the specified manga
    const review = user.reviews.find((r) => r.mangaId === mangaId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
});

router.put("/progress", authMiddleware, async (req, res) => {
  const { mangaId, progress } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mangaProgress = user.progress.find((p) => p.mangaId === mangaId);

    if (mangaProgress) {
      mangaProgress.progress = progress;
    } else {
      user.progress.push({ mangaId, progress });
    }

    await user.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
});

router.get("/progress/:mangaId", authMiddleware, async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mangaProgress = user.progress.find((p) => p.mangaId === mangaId);

    res.status(200).json(mangaProgress || { progress: 0 });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
});

module.exports = router;
