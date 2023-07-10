const Post = require("../models/post.model");
const cloudinary = require("../utils/cloudinary");
const jwt = require('jsonwebtoken')

exports.findAll = async (req, res) => {
  // const allPosts = Post.find((err, posts) => {
  //   res.json(posts)
  // })
  const allPosts = await Post.find()
    .populate([{
      path: 'author'
    }])
  res.json(allPosts)
}


exports.fake = async (req, res) => {
  res.json([])
}

exports.findPost = async (req, res) => {
  try {
    const id = req.params.id

    let post = await Post.findById(id)
    if (!post) {
      res.send(false)
    }

    post = await Post.findById(id)
      .populate([{
        path: 'author',
        path: 'comments',
        populate: {
          path: 'author'
        },
      }])
    res.json(post)
  } catch (err) {
    res.send()
  }

}
exports.create = async (req, res) => {
  try {
    // new post
    const result = await cloudinary.uploader.upload(req.file.path);

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      author: req.user._id
    })

    // save post in the database
    await post.save()
    return res.json(post)
  }
  catch (err) {
    res.status(500).json({ errorMessage: 'Cannot create post' })
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await Post.findById(id)
    if (!post) {
      return res.send('Post not found')
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { invalidate: true });

      Post.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        image: result.secure_url,
        cloudinary_id: result.public_id
      })
        .then(data => {
          if (!data) {
            return res.status(404).json({ errorMessage: `Post not found` })
          } else {
            return res.json(data)
          }
        })
    } else {
      Post.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
      })
        .then(data => {
          if (!data) {
            return res.status(404).json({ errorMessage: `Post not found` })
          } else {
            return res.json(data)
          }
        })
    }
  }
  catch (err) {
    return res.status(500).json({ errorMessage: "Cannot update post" })
  }
}
exports.delete = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ errorMessage: `Post not found` })
      } else {
        res.send({ message: "Post was deleted successfully!" })
      }
    })
    .catch(err => {
      res.status(500).send({
        errorMessage: "Cannot delete post"
      });
    });
}