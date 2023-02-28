const mongoose = require("mongoose");

const Fav = mongoose.model("Favourite", {
  name: {
    unique: true,
    type: String,
  },

  image: {
    required: true,
    type: String,
  },

  favToken: String,
});

module.exports = Fav;
