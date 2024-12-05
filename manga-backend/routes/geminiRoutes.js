const express = require("express");
const axios = require("axios");
const router = express.Router();
//import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Proxy route to handle Gemini API requests
router.post("/gemini/chat", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", // Replace with the actual Gemini API endpoint
      { input },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch data from Gemini API." });
  }
});

module.exports = router;
