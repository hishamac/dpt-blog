const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // each comment can only relates to one blog, so it's not in array
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment