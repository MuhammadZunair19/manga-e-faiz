const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mangaId: { type: String, required: true },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Favorites", favoriteSchema);
