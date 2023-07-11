const Author = require("../models/author.model");
const Post = require("../models/post.model");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

exports.findAll = async (req, res) => {
  const allAuthors = await Author.find();
  res.json(allAuthors);
};

exports.findAuthorPosts = async (req, res) => {
  const id = req.params.id;

  const authorPosts = await Post.find({ author: id });
  res.json(authorPosts);
};

exports.findAuthor = async (req, res) => {
  try {
    const id = req.params.id;

    let author = await Author.findById(id);
    if (!author) {
      res.status(500).json({ errorMessage: `Author not found` });
    }

    author = await Author.findById(id);
    res.json(author);
  } catch (err) {
    res.status(500).json({ errorMessage: `Error while finding author` });
  }
};
exports.create = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const author = new Author({
      name: req.body.name,
      avatar: result.secure_url,
    });

    const createdAuthor = await author.save();
    return res.json(createdAuthor);
  } catch (err) {
    res.status(500).json({ errorMessage: "Cannot create author" });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let author = await Author.findById(id);
    if (!author) {
      res.status(500).json({ errorMessage: `Author not found` });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        invalidate: true,
      });

      await Author.findByIdAndUpdate(id, {
        name: req.body.name,
        avatar: result.secure_url,
      }).then((data) => {
        !data
          ? res.status(500).json({ errorMessage: `Author not found` })
          : res.json(data);
      });
    } else {
      await Author.findByIdAndUpdate(id, {
        name: req.body.name,
      }).then((data) => {
        !data
          ? res.status(500).json({ errorMessage: `Author not found` })
          : res.json(data);
      });
    }
  } catch (err) {
    return res.status(500).json({ errorMessage: "Cannot update author" });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Author.findByIdAndDelete(id)
    .then((data) => {
      !data
        ? res.status(500).json({ errorMessage: `Author not found` })
        : res.send({ message: "Author was deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        errorMessage: "Cannot delete author",
      });
    });
};
