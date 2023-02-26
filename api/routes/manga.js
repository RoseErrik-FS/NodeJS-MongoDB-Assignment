const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manga = require("../models/manga");
const Messages = require("../../messages/messages");

// getting all entries
router.get("/", (req, res, next) => {
  Manga.find()
    .select("-__v")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: Messages.manga_entry_all,
        count: result.length,
        manga: result,
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
  const newManga = new Manga({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    volumes: req.body.volumes,
  });

  //write to the database
  newManga
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: Messages.manga_entry_saved,
        manga: {
          title: result.title,
          author: result.author,
          volumes: req.body.volumes,
          id: result._id,
        },
        metadata: {
          method: req.method,
          host: req.hostname,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          error: {
            message: Messages.manga_entry_exists,
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

//finding the manga by id
router.get("/:mangaId", (req, res, next) => {
  const mangaId = req.params.mangaId;
  Manga.findById(mangaId)
    .select("-__v")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: Messages.manga_entry_GETbyID,
          manga: result,
          metadata: {
            method: req.method,
            host: req.hostname,
          },
        });
      } else {
        res.status(404).json({
          message: Messages.manga_entry_novalid,
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
router.patch("/:mangaId", (req, res, next) => {
  const mangaId = req.params.mangaId;

  const updateManga = {
    title: req.body.title,
    author: req.body.author,
    volumes: req.body.volumes,
  };

  Manga.updateOne(
    {
      _id: mangaId,
    },
    {
      $set: updateManga,
    }
  )
    .then(() => {
      return Manga.findOne({ _id: mangaId }).select('-__v');
    })
    .then((result) => {
      res.status(200).json({
        message: Messages.manga_entry_updated,
        manga: {
          title: result.title,
          author: result.author,
          id: result._id,
          volumes: req.body.volumes,
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
router.delete("/:mangaId", (req, res, next) => {
  const mangaId = req.params.mangaId;
  Manga.findByIdAndDelete(mangaId)
    .select("-__v")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: Messages.manga_entry_deleted,
          manga: result,
          metadata: {
            method: req.method,
            host: req.hostname,
          },
        });
      } else {
        res.status(404).json({
          message: Messages.manga_entry_novalid,
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
