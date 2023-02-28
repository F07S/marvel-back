const mongoose = require("mongoose");

const Comment = mongoose.model("Comment", {
  name: {
    unique: true,
    type: String,
  },

  comment: {
    required: true,
    type: String,
  },
});

module.exports = Comment;
