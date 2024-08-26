const express = require("express");
const router = express.Router();
const Video = require("../models/video");
const upload = require("../middlewares/upload");

router.post("/upload", upload.single("video"), async (req, res) => {
  const { title, description } = req.body;
  const videoPath = req.file.path;

  const newVideo = new Video({
    title,
    description,
    url: videoPath,
    thumbnail: "path/to/default/thumbnail.jpg", // Remplacez par la logique de génération de vignettes
  });

  try {
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
