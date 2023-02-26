const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  volumes: { type: String, required: true },
});

module.exports = mongoose.model("Manga", mangaSchema);
