const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role:{
    type:String,
  },
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  }
})

const User = mongoose.model("User", userSchema)
module.exports = User