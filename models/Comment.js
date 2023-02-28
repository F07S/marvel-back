const mongoose = require("mongoose");

const Comment = mongoose.model("Comment", {
  name: {
    unique: true,
    type: String,
  },

  comment: String,
});

module.exports = Comment;
