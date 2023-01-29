const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

router.get("/login", async (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("auth/login");
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.redirect("/login");

    const passwordIsEqual = await user.checkPassword(password);
    if (!passwordIsEqual) return res.redirect("/login");

    user.password = undefined;
    req.session.user = user;
    res.redirect("/");
  } catch (e) {
    res.redirect("/login");
  }
});

module.exports = router;
