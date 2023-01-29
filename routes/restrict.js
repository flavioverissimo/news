const express = require("express");
const router = express.Router();

// Controller and Model
const restrictController = require("../controllers/restrict");
const News = require("../models/news");
const models = {
  News,
};

// User validation
router.use(async (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
});

// restrict route
router.get("/news", restrictController.getRestricNews.bind(null, models));

module.exports = router;
