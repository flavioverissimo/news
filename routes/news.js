const express = require("express");
const router = express.Router();

// Controller and Model
const newsController = require("../controllers/news");
const News = require("../models/news");
const models = {
  News,
};

// news route
router.get("/", newsController.getPublicNews.bind(null, models));

module.exports = router;
