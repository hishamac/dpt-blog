const Admin = require("../models/admin.model");
const Post = require("../models/post.model");
const Author = require("../models/author.model");
const Tag = require("../models/tag.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const localStorage = require("localStorage");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validation

    if (!username || !password)
      return res.json({
        messageType: "error",
        message: "Please enter all required fields.",
      });

    let admin = await Admin.findOne({ username });
    if (admin)
      return res.json({
        messageType: "error",
        message: "An account with this username already exists.",
      });

    admin = new Admin({
      username,
      password,
    });

    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(admin.password, salt);

    const createdAdmin = await admin.save();
    if (!createdAdmin)
      return res.json({
        messageType: "success",
        message: "Admin created successfully.",
      });

    const toToken = {
      username: createdAdmin.username,
      role: createdAdmin.role,
    };

    // sign the token
    const token = jwt.sign(
      {
        toToken,
      },
      process.env.JWT_SECRET
    );
    localStorage.setItem("token", token);
    console.log(localStorage.getItem("token"));
    return res.send(token);
  } catch (err) {
    console.error(err);
    res.json({
      messageType: "error",
      message: "Error while creating admin",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate

    if (!username || !password)
      return res.json({
        messageType: "error",
        message: "Please enter all required fields.",
      });

    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin)
      return res.json({
        messageType: "error",
        message: "Wrong username or password.",
      });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!passwordCorrect)
      return res.json({
        messageType: "error",
        message: "Wrong username or password.",
      });

    const toToken = {
      username: existingAdmin.username,
      role: existingAdmin.role,
    };

    const token = jwt.sign(
      {
        toToken,
      },
      process.env.JWT_SECRET
    );
    localStorage.setItem("token", token);
    return res.json({
      messageType: "success",
      message: "Logged in successfully.",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.json({
      messageType: "error",
      message: "Error while logging in admin",
    });
  }
};

exports.allLengths = async (req, res) => {
  try {
    const posts = (await Post.find()).length;
    const authors = (await Author.find()).length;
    const tags = (await Tag.find()).length;
    res.json({ posts, authors, tags });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Error while getting all lengths",
    });
  }
};
