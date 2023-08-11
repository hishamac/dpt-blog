const Post = require("../models/post.model");
const Author = require("../models/author.model");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

exports.findAll = async (req, res) => {
  try {
    const allPosts = await Post.find().populate([
      {
        path: "tags",
      },
      {
        path: "author",
      },
    ]);
    res.json(allPosts);
  } catch (error) {
    res.json({ messageType: "error", message: `Problem while getting Posts` });
  }
};

exports.findPost = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await Post.find({ slug: id });
    if (!post) {
      res.json({ messageType: "error", message: `Post not found` });
    }

    post = await Post.find({ slug: id }).populate([
      {
        path: "tags",
      },
      {
        path: "author",
      },
    ]);
    res.json(post);
  } catch (err) {
    res.json({ messageType: "error", message: `Problem while finding post` });
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
    if (!author) {
      return res.json({ messageType: "error", message: `Author not found` });
    }
    await post.save();
    return res.json({ messageType: "success", message: "New Post created" });
  } catch (err) {
    return res.json({ messageType: "error", message: "Cannot create post" });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await Post.findById(id);
    if (!post) {
      res.json({ messageType: "error", message: `Post not found` });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        invalidate: true,
      });

      await Post.findOneAndUpdate(
        { _id: id },
        {
          title: req.body.title,
          author: req.body.author,
          content: req.body.content,
          image: result.secure_url,
          tags: req.body.tags,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Post not found` })
          : res.json({
              messageType: "success",
              message: "Post updated successfully",
            });
      });
    } else {
      await Post.findOneAndUpdate(
        { _id: id },
        {
          title: req.body.title,
          author: req.body.author,
          content: req.body.content,
          tags: req.body.tags,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Post not found` })
          : res.json({
              messageType: "success",
              message: "Post updated successfully",
            });
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

exports.delete = (req, res) => {
  try {
    const id = req.params.id;

    Post.findByIdAndDelete(id)
      .then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Post not found` })
          : res.send({
              messageType: "success",
              message: "Post was deleted successfully!",
            });
      })
      .catch((err) => {
        res.send({
          messageType: "error",
          message: "Sorry, Problem while deleting post",
        });
      });
  } catch (error) {
    res.json({
      messageType: "error",
      message: "Sorry, Problem while deleting post",
    });
  }
};
