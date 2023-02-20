const mongoose = require("mongoose");

const animeSchema = mongoose.Schemas({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    author: String,
})

module.exports = mongoose.models("Anime", animeSchema)