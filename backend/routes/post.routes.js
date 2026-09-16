const express = require("express");
const router = express.Router();
const {
  setPosts,
  editPost,
  deletePost,
  getPosts,
  likePost,
  dislikePost,
} = require("../controllers/post.controller");
const { body } = require("express-validator");

// Routes
router.get("/", getPosts);

router.post(
  "/",
  [
    body("message").notEmpty().withMessage("Le message ne peut pas être vide"),
    body("author").notEmpty().withMessage("L'auteur ne peut pas être vide"),
  ],
  setPosts,
);

router.put("/:id", editPost);

router.delete("/:id", deletePost);

router.post("/:id/like", likePost);

router.post("/:id/dislike", dislikePost);

module.exports = router;
