const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  manga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manga',
    required: true
  },
  studio: { type: String, required: true },
  seasons: { type: String, required: true },
  episodes: { type: String, required: true },
});


module.exports = mongoose.model("Anime", animeSchema);
