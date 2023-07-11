const cloudinary = require("../utils/cloudinary");
const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validation

    if (!username || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    let admin = await Admin.findOne({ username });
    if (admin)
      return res.status(400).json({
        errorMessage: "An account with this username already exists.",
      });

    admin = new Admin({
      username,
      password,
    });

    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(admin.password, salt);

    await admin.save();
    console.log(admin);

    // sign the token
    const token = jwt.sign(
      {
        _id: admin._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send("Admin created");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error while creating admin");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate

    if (!username || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin)
      return res
        .status(401)
        .json({ errorMessage: "Wrong username or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!passwordCorrect)
      return res
        .status(401)
        .json({ errorMessage: "Wrong username or password." });

    // sign the token

    const token = jwt.sign(
      {
        _id: existingAdmin._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send("Admin logged in");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while logging in admin");
  }
};

exports.logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send("Logged out");
};

exports.getIsLogged = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.send(false);

    jwt.verify(token, process.env.JWT_SECRET);
    res.send(true);
  } catch (err) {
    res.send(false);
  }
};

exports.getLoggedAdmin = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.send(false);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded._id);
  req.admin = admin;
  res.json(admin);
};

exports.getRole = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.send(false);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded._id);
  req.admin = admin;
  res.send(admin.role);
};
