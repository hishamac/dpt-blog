const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  }
});

const author = mongoose.model("Author", authorSchema)
module.exports = author;
