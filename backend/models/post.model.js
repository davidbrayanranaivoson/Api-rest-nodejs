const mongoose = require("mongoose");
const { timeStamp } = require("node:console");
const { type } = require("node:os");

const postSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    likers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("post", postSchema);
