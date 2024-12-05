const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mangaId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String },
  genres: [String],
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Library", librarySchema);
