const express = require("express");
const router = express.Router();

// Static routes
router.get("/", async (req, res) => {
  res.render("index");
});

module.exports = router;
