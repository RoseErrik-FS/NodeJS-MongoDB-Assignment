const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Anime = require("../models/anime");
const Manga = require("../models/manga");
const Messages = require("../../messages/messages");

// getting all entries
router.get("/", (req, res, next) => {
  Anime.find()
    .select("-__v")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: Messages.anime_entry_all,
        count: result.length,
        anime: result,
        metadata: {
          method: req.method,
          host: req.hostname,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

router.post("/", (req, res, next) => {
  const mangaTitle = req.body.title;
  Manga.findOne({ title: mangaTitle })
    .exec()
    .then((manga) => {
      if (!manga) {
        throw new Error("Manga not found");
      }
      const anime = new Anime({
        _id: manga._id,
        title: req.body.title,
        studio: req.body.studio,
        seasons: req.body.seasons,
        episodes: req.body.episodes,
      });
      return anime.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: Messages.anime_entry_saved,
        anime: {
          title: req.body.title,
          studio: req.body.studio,
          seasons: req.body.seasons,
          episodes: req.body.episodes,
          id: result._id,
        },
        metadata: {
          method: req.method,
          host: req.hostname,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Manga not found") {
        res.status(404).json({
          message: Messages.manga_entry_notfound,
        });
      } else if (err.code === 11000) {
        res.status(500).json({
          error: {
            message: Messages.anime_entry_exists,
          },
        });
      } else {
        res.status(500).json({
          error: {
            message: err.message,
          },
        });
      }
    });
});

//finding the anime by id
router.get("/:animeId", (req, res, next) => {
  const animeId = req.params.animeId;
  Anime.findById(animeId)
    .select("studio seasons episodes _Id")
    .populate("manga", "title author volumes")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: Messages.anime_entry_GETbyID,
          anime: result,
          metadata: {
            method: req.method,
            host: req.hostname,
          },
        });
      } else {
        res.status(404).json({
          message: Messages.anime_entry_novalid,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// updating the entry
router.patch("/:animeId", (req, res, next) => {
  const animeId = req.params.animeId;

  const updateAnime = {
    title: req.body.title,
    studio: req.body.studio,
    seasons: req.body.seasons,
    episodes: req.body.episodes,
  };

  Anime.updateOne(
    {
      _id: animeId,
    },
    {
      $set: updateAnime,
    }
  )
    .then(() => {
      return Anime.findOne({ _id: animeId }).select("-__v");
    })
    .then((result) => {
      res.status(200).json({
        message: Messages.anime_entry_updated,
        anime: {
          title: req.body.title,
          studio: req.body.studio,
          seasons: req.body.seasons,
          episodes: req.body.episodes,
          id: result._id,
        },
        metadata: {
          method: req.method,
          host: req.hostname,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

//deleting from the database by id
router.delete("/:animeId", (req, res, next) => {
  const animeId = req.params.animeId;
  Anime.findByIdAndDelete(animeId)
    .select("-__v")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: Messages.anime_entry_deleted,
          anime: result,
          metadata: {
            method: req.method,
            host: req.hostname,
          },
        });
      } else {
        res.status(404).json({
          message: Messages.anime_entry_novalid,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

module.exports = router;
