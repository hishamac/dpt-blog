const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model.js");

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);
    if (!admin.role === "admin") {
      return res.status(401).json({
        errorMessage: "You are not Admin to perform this action",
      });
    }
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
};
