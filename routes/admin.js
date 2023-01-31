const express = require("express");
const router = express.Router();

// Controller and Model
const adminController = require("../controllers/admin");
const News = require("../models/news");
const Users = require("../models/users");
const models = {
  News,
  Users,
};

// User validation
router.use(async (req, res, next) => {
  if (!req.isAuthenticated() || req.user.roles.indexOf("admin") == -1) {
    return res.redirect("/");
  }
  next();
});

// Admin Panel
router.get("/", adminController.admin);

// news routes
router.get("/news", adminController.getNews.bind(null, models));
router.get("/news/create", adminController.createNewsGet);
router.post("/news/create", adminController.createNewsPost.bind(null, models));
router.get("/news/edit/:id", adminController.editNewsGet.bind(null, models));
router.post("/news/edit/:id", adminController.editNewsPost.bind(null, models));
router.get("/news/delete/:id", adminController.removeNews.bind(null, models));

// users routes
router.get("/users", adminController.getUsers.bind(null, models));
router.get("/users/create", adminController.createUserGet);
router.post("/users/create", adminController.createUserPost.bind(null, models));
router.get("/users/edit/:id", adminController.editUserGet.bind(null, models));
router.post("/users/edit/:id", adminController.editUserPost.bind(null, models));
router.get("/users/delete/:id", adminController.removeUser.bind(null, models));

// exporting the router
module.exports = router;
