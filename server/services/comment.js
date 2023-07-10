const Comment = require("../models/comment.model")
const Post = require("../models/post.model")

exports.create = async (req, res) => {
  try {
    // find out which post you are commenting
    const id = req.params.id;
    // get the comment text and record post id
    const comment = new Comment({
      text: req.body.comment,
      post: id,
      author: req.user._id
    })
    // save comment
    await comment.save();
    res.send(comment)
    // get this particular post
    const post = await Post.findById(id);
    // push the comment into the post.comments array
    post.comments.push(comment);
    // save and redirect...
    await post.save()
  } catch (err) {
    res.send(err)
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    let comment = await Comment.findById(id)
    if (!comment) {
      return res.send('Comment not found')
    }

    await Comment.findByIdAndUpdate(id, {
      text: req.body.comment
    })
      .then(data => {
        if (!data) {
          return res.status(404).json({ errorMessage: `Comment not found` })
        } else {
          return res.json(data)
        }
      })
  }
  catch (err) {
    return res.status(500).json({ errorMessage: "Cannot update post" })
  }
}

exports.delete = (req, res) => {
  const id = req.params.id;

  Comment.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ errorMessage: `Comment not found` })
      } else {
        res.send({ message: "Comment was deleted successfully!" })
      }
    })
    .catch(err => {
      res.status(500).send({
        errorMessage: "Cannot delete Comment"
      });
    });
}

exports.findComment = async (req, res) => {
  try {
    const id = req.params.id

    let comment = await Comment.findById(id)
    if (!comment) {
      res.send(false)
    }

    comment = await Comment.findById(id)
      .populate([{
        path: 'author'
      }])
    res.json(comment)
  } catch (err) {
    res.send()
  }

}