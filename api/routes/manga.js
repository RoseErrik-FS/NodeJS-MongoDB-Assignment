const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manga = require("../models/manga");

// getting all entries
router.get("/", (req, res, next) => {
    Manga.find()
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "A list of all manga in the database",
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
    volumes: req.body.volumes
  });

  //write to the database
newManga
  .save()
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Manga was successfully saved",
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
            message: "Manga with that title already exists",
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
      .exec()
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Manga - GET by ID",
            manga: result,
            metadata: {
              method: req.method,
              host: req.hostname,
            },
          });
        } else {
          res.status(404).json({
            message: "No valid entry found for provided ID",
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
      volumes: req.body.volumes
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
        return Manga.findOne({_id: mangaId});
      })
      .then((result) => {
        res.status(200).json({
          message: "Manga was successfully updated",
          manga: {
            title: result.title,
            author: result.author,
            id: result._id,
            volumes: req.body.volumes
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
      .exec()
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Manga was successfully deleted",
            manga: result,
            metadata: {
              method: req.method,
              host: req.hostname,
            },
          });
        } else {
          res.status(404).json({
            message: "No valid entry found for provided ID",
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
