var mongoose = require("mongoose");
(slug = require("mongoose-slug-updater")), mongoose.plugin(slug);
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  slug: {
    type: String,
    slug: "name",
    unique: true,
  },
});

const author = mongoose.model("Author", authorSchema);
module.exports = author;
