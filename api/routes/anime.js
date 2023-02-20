const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    message: "Anime - GET",
  });
});

router.post("/", (req, res, next) => {
  res.json({
    message: "Anime - POST",
  });
});

router.get("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
  res.json({
    message: "Anime ID - GET",
    id: authorId,
  });
});

router.patch("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
  res.json({
    message: "Anime ID - PATCH",
    id: authorId,
  });
});

router.delete("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
  res.json({
    message: "Anime ID - DELETE",
    id: authorId,
  });
});

module.exports = router;
