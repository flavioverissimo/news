const mongoose = require("mongoose");

const NewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  rule: {
    type: String,
    required: true,
    enum: ["public", "restrict"],
  },
});

const New = mongoose.model("New", NewSchema);

module.exports = New;
