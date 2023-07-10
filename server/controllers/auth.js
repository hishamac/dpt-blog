const cloudinary = require("../utils/cloudinary");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, } = req.body;

    // validation

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    // hash the password

    const result = await cloudinary.uploader.upload(req.file.path);

    // save a new user account to the db

    user = new User({
      name,
      email,
      password,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
      role:'user'
    });

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    console.log(user)
    // sign the token

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    // sign the token

    const token = jwt.sign(
      {
        _id: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

exports.logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send('Logged out');
}

exports.getIsLogged = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.send(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.send(false);
  }
}

exports.getLoggedUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.send(false);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  req.user = user;
  res.json(user)
}

exports.getUserRole = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.send(false);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);
  req.user = user;
  res.send(user.role)
}