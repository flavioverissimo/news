const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  user.password = undefined;
  done(null, user);
});

passport.deserializeUser((user, done) => {
  user.password = undefined;
  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);

      const passwordIsEqual = await user.checkPassword(password);
      if (!passwordIsEqual) return done(null, false);

      user.password = undefined;
      return done(null, user);
    } catch (e) {
      return done(null, false);
    }
  })
);

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("auth/login");
});

router.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })
);

module.exports = router;
