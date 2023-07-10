const jwt = require("jsonwebtoken");
const User = require('../models/user.model.js')

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user.role === 'admin') {
      return res.status(401).json({
        errorMessage: "You are not Admin to perform this action",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
}
