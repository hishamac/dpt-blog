const Author = require("../models/author.model");
const Post = require("../models/post.model");
const cloudinary = require("../utils/cloudinary");

exports.findAll = async (req, res) => {
  try {
    const allAuthors = await Author.find();
    res.json(allAuthors);
  } catch (error) {
    res.json({
      messageType: "error",
      message: `Error while finding all authors`,
    });
  }
};

exports.findAuthorPosts = async (req, res) => {
  try {
    const id = req.params.id;

    const authorPosts = await Post.find({ author: id });
    res.json(authorPosts);
  } catch (error) {
    res.json({
      messageType: "error",
      message: `Error while finding author's posts`,
    });
  }
};

exports.findAuthor = async (req, res) => {
  try {
    const id = req.params.id;

    let author = await Author.find({ slug: id });
    if (!author) {
      res.json({ messageType: "error", message: `Author not found` });
    }

    author = await Author.findById(id);
    res.json(author);
  } catch (err) {
    res.json({ messageType: "error", message: `Error while finding author` });
  }
};
exports.create = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const author = new Author({
      name: req.body.name,
      avatar: result.secure_url,
    });

    await author.save();
    return res.json({ messageType: "success", message: "New Author created" });
  } catch (err) {
    res.json({ messageType: "error", message: "Cannot create author" });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let author = await Author.findById(id);
    if (!author) {
      res.json({ messageType: "error", message: `Author not found` });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        invalidate: true,
      });

      await Author.findOneAndUpdate(
        { _id: id },
        {
          name: req.body.name,
          avatar: result.secure_url,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Author not found` })
          : res.json({
              messageType: "success",
              message: "Author updated Successfully",
            });
      });
    } else {
      await Author.findOneAndUpdate(
        { _id: id },
        {
          name: req.body.name,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Author not found` })
          : res.json({
              messageType: "success",
              message: "Author updated Successfully",
            });
      });
    }
  } catch (err) {
    return res.json({
      messageType: "error",
      message: "Problem while updating author",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const allPosts = await Post.find();
    const author = await Author.findById(id);

    if (!author) {
      return res.json({ messageType: "error", message: `Author not found` });
    }

    for (let i = 0; i < allPosts.length; i++) {
      const singlePost = allPosts[i];

      if (singlePost.author.equals(author._id)) {
        return res.json({ messageType: "error", message: `Author has posts` });
      }
    }

    await Author.findByIdAndDelete(id)
      .then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Author not found` })
          : res.json({
              messageType: "success",
              message: "Author was deleted successfully!",
            });
      })
      .catch((err) => {
        res.json({
          messageType: "error",
          message: "Cannot delete author",
        });
      });
  } catch (error) {
    res.json({ messageType: "error", message: "Cannot delete author" });
  }
};
