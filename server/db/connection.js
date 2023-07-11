const mongoose = require('mongoose')

// const connectDB =() => mongoose.connect(process.env.MONGO_URI,
const connectDB =() => mongoose.connect(process.env.MONGO_URI,
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

module.exports = connectDB