const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mangaId: { type: String, required: true },
  title: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RecentlyViewed", recentlyViewedSchema);
