const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  mangaId: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reviews: [reviewSchema],
});

module.exports = mongoose.model("User", userSchema);
