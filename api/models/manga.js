const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  volumes: { type: String }
});

module.exports = mongoose.model("Manga", mangaSchema)