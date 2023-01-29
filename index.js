const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const app = express();

// Default Variables
const port = process.env.PORT || 3000;

// utils and routes
const createDefaultUsers = require("./utils/createDefaultUsers");
const generalRoutes = require("./routes/index");
const publicNews = require("./routes/news");
const restrictNews = require("./routes/restrict");
const auth = require("./routes/auth");
const adminNews = require("./routes/admin");

// environment variables definition
dotenv.config({ path: "./.env" });

// app definition
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// General routes
app.use("/", auth);
app.use("/", generalRoutes);
app.use("/news", publicNews);
app.use("/restrict", restrictNews);
app.use("/admin", adminNews);

// function to connect on the database
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_ACCESS);
    createDefaultUsers();
    app.listen(port, () => {
      console.log(`It was connected on port: ${port}`);
    });
  } catch (e) {
    console.log(`It wasn't possible to connect on the server`);
  }
};

// calling the function to connect
connectDB();
