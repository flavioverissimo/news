const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

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

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "",
//       clientSecret: "",
//       callbackURL: "http://localhost:3000/facebook/callback",
//       profileFields: ["id", "displayName", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const userDB = await User.findOne({ facebookId: profile.id });
//       if (!userDB) {
//         const user = await User.create({
//           name: profile.displayName,
//           facebookId: profile.id,
//           roles: ["user"],
//         });
//         done(null, user);
//       } else {
//         done(null, userDB);
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: "insert client id here",
      clientSecret: "insert client Secret here",
      callbackURL: "http://localhost:3000/google/callback",
    },
    async (accessToken, refreshToken, err, profile, done) => {
      const userDB = await User.findOne({ googleId: profile.id });
      if (!userDB) {
        const user = await User.create({
          name: profile.displayName,
          googleId: profile.id,
          roles: ["user"],
        });
        done(null, user);
      } else {
        done(null, userDB);
      }
    }
  )
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

// router.get("/facebook", passport.authenticate("facebook"));
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/",
//   }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/",
  })
);

module.exports = router;
