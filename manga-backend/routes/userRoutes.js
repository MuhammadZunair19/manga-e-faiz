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
  const { mangaId } = req.body;
  const userId = req.user.id;

  if (!mangaId) {
    return res.status(400).json({ message: "Manga ID is required" });
  }

  try {
    const favorite = new Favorites({ userId, mangaId });
    await favorite.save();
    res.status(201).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Error adding to favorites" });
  }
});

module.exports = router;
