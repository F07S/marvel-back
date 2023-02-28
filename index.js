const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
app.use(userRoutes);

const Fav = require("./models/Fav");
const Comment = require("./models/Comment");

app.get("/", (req, res) => {
  try {
    res.json("Test route");
  } catch {
    res.status(400).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    const name = req.query.name || "";
    const page = req.query.page || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "100";

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${name}&skip=${skip}&limit=${limit}`
    );
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/character/:id", async (req, res) => {
  try {
    const characterId = req.params.id;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${characterId}?apiKey=${process.env.API_KEY}`
    );
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/comics/character/:id", async (req, res) => {
  try {
    const characterId = req.params.id;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.API_KEY}`
    );
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const title = req.query.title || "";
    const skip = req.query.skip || "0";
    const limit = req.query.limit || "100";

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&title=${title}&skip=${skip}&limit=${limit}`
    );
    // console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.post("/addfavourites", async (req, res) => {
  try {
    const { name, image } = req.body;
    const newFav = new Fav({
      name: name,
      image: image,
    });
    await newFav.save();
    const clientRes = {
      name: newFav.name,
      image: newFav.image,
    };
    res.json(clientRes);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/favourites", async (req, res) => {
  try {
    const favourites = await Fav.find();
    res.json({ favourites: favourites });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.delete("/favourites/delete/:id", async (req, res) => {
  try {
    favToDelete = await Fav.findById(req.params.id);
    await favToDelete.delete();
    res.status(200).json("Favourite succesfully deleted !");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.post("/favourites/comments", async (req, res) => {
  try {
    const { name, comment } = req.body;
    const newComment = new Comment({
      name: name,
      comment: comment,
    });
    await newComment.save();
    const clientRes = {
      name: newComment.name,
      comment: newComment.comment,
    };
    res.json(clientRes);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json({ comments: comments });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json("Route introuvable");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started");
});
