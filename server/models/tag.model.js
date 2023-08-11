var mongoose = require("mongoose");
(slug = require("mongoose-slug-updater")), mongoose.plugin(slug);
const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
