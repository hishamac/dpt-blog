const Post = require("../models/post.model");
const Author = require("../models/author.model");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

exports.findAll = async (req, res) => {
  const allPosts = await Post.find().populate([
    {
      path: "tags",
    },
    {
      path: "author",
    },
  ]);
  res.json(allPosts);
};

exports.findPost = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await Post.findById(id);
    if (!post) {
      res.status(500).json({ errorMessage: `Post not found` });
    }

    post = await Post.findById(id).populate([
      {
        path: "tags",
      },
      {
        path: "author",
      },
    ]);
    res.json(post);
  } catch (err) {
    res.status(500).json({ errorMessage: `Error while finding post` });
  }
};
exports.create = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: result.secure_url,
      author: req.body.author,
      tags: req.body.tags,
    });
    const author = await Author.findById(post.author);
    if(!author) {
      return res.status(500).json({ errorMessage: `Author not found` });
    }
    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (err) {
    return res.status(500).json({ errorMessage: "Cannot create post" });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await Post.findById(id);
    if (!post) {
      res.status(500).json({ errorMessage: `Post not found` });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        invalidate: true,
      });

      await Post.findByIdAndUpdate(id, {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        image: result.secure_url,
        tags: req.body.tags,
      }).then((data) => {
        !data
          ? res.status(500).json({ errorMessage: `Post not found` })
          : res.json(data);
      });
    } else {
      await Post.findByIdAndUpdate(id, {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        tags: req.body.tags,
      }).then((data) => {
        !data
          ? res.status(500).json({ errorMessage: `Post not found` })
          : res.json(data);
      });
    }
  } catch (err) {
    return res.status(500).json({ errorMessage: "Cannot update post" });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then((data) => {
      !data
        ? res.status(500).json({ errorMessage: `Post not found` })
        : res.send({ message: "Post was deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        errorMessage: "Cannot delete post",
      });
    });
};
