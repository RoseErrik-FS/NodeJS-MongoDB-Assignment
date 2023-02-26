const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const animeRoutes = require("../api/routes/anime");
const mangaRoutes = require("../api/routes/manga");

// middleware for logging with morgan
app.use(morgan("dev"));

// parsing middleware info
app.use(
  express.urlencoded({
    extended: true,
  })
);
// middleware for json requests
app.use(express.json());

//middleware for CORS Policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH");
  }

  next();
});

app.get("/", (req, res, next) => {
  res.status(201).json({
    message: "Service is Running!",
    method: req.method,
  });
});

app.use("/manga", mangaRoutes);
app.use("/anime", animeRoutes);

// adding middleware for errors and bad url requests
app.use((req, res, next) => {
  const error = new Error("NOT FOUND!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status,
      method: req.method,
    },
  });
});

// connecting to mongoose
mongoose.connect(process.env.MONGODBURL, (err) => {
  if (err) {
    console.error("Error", err.message);
  } else {
    console.log("Successfully Connected to DataBase");
  }
});
module.exports = app;
