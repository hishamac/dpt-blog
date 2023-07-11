const Tag = require("../models/tag.model");

exports.findAll = async (req, res) => {
  const allTags = await Tag.find();
  res.json(allTags);
};

exports.findTag = async (req, res) => {
  try {
    const id = req.params.id;

    let tag = await Tag.findById(id);
    if (!tag) {
      res.status(500).json({ errorMessage: `Tag not found` });
    }

    tag = await Tag.findById(id);
    res.json(tag);
  } catch (err) {
    res.status(500).json({ errorMessage: `Tag not found` });
  }
};

exports.create = async (req, res) => {
  try {
    const tag = new Tag({
      title: req.body.title,
      description: req.body.description,
    });
    await tag.save();
    res.send(tag);
  } catch (err) {
    res.status(500).json({ errorMessage: `Error while creating Tag` });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const [title, description] = req.body;
  try {
    let tag = await Tag.findById(id);
    if (!tag) {
      return res.status(500).json({ errorMessage: `Tag not found` });
    }

    await Tag.findByIdAndUpdate(id, {
      title,
      description,
    }).then((data) => {
      !data
        ? res.status(500).json({ errorMessage: `Tag not found` })
        : res.json(data);
    });
  } catch (err) {
    res.status(500).json({ errorMessage: "Cannot update Tag" });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    let tag = await Tag.findById(id);
    if (!tag) {
      return res.status(500).json({ errorMessage: `Tag not found` });
    }

    Tag.findByIdAndDelete(id).then((data) => {
      !data
        ? res.status(500).json({ errorMessage: `Tag not found` })
        : res.send({ message: "Tag was deleted successfully!" });
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Cannot delete Tag",
    });
  }
};
