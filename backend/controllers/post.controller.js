const PostModel = require("../models/post.model");
const { validationResult } = require("express-validator");
const expressSanitizer = require("express-mongo-sanitize");

//Céation de la fonction getPosts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ err: `Unable to fetch posts : ${err}` });
  }
};

//Céation de la fonction setPosts
module.exports.setPosts = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    req.body.message = expressSanitizer.sanitize(req.body.message);
    req.body.author = expressSanitizer.sanitize(req.body.author);
    const post = await PostModel.create({
      message: req.body.message,
      author: req.body.author,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ err: `Failed to create post : ${err}` });
  }
};

module.exports.editPost = async (req, res) => {
  const post = await PostModel.findById(req.params.id);

  try {
    if (!post) {
      return res.status(400).json({ message: "Ce post n'existe pas" });
    }

    const updatePost = await PostModel.findByIdAndUpdate(post, req.body, {
      new: true,
    });
    
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json({ err: `Failed to update post : ${err}` });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: "Ce post n'existe pas" });
    }

    await post.deleteOne();

    res.status(200).json("Message supprimé");
  } catch (err) {
    res.status(500).json({ error: `Failed to delete post : ${err}` });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: "Ce post n'existe pas" });
    }

    await post.updateOne(
      { $addToSet: { likers: req.body.userId } },
      { new: true },
    );

    res.status(200).send(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.dislikePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: "Ce post n'existe pas" });
    }

    await post.updateOne({ $pull: { likers: req.body.userId } }, { new: true });

    res.status(200).send(post);
  } catch (error) {
    res.status(500).json(error);
  }
};
