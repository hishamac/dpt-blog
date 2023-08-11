const jwt = require("jsonwebtoken");
const localStorage = require("localStorage");

exports.adminAuth = async (req, res, next) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return res.json({ errorMessage: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.toToken.role == "admin") {
      return res.json({
        errorMessage: "Unauthorized",
      });
    } else {
      req.admin = decoded;
    }
    next();
  } catch (err) {
    res.json({ errorMessage: "3 Unauthorized" });
  }
};
