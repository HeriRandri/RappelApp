const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./router/router");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const mongoUrl = "mongodb://localhost:27017/rappel";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/Images", express.static(path.join(__dirname, "Images")));

app.set("view engine", "ejs");
// const viewDirectory = path.join(__dirname, "views");
// app.set("views", viewDirectory);

app.use(express.static(path.join(__dirname, "Images")));
app.use(router);
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(4001);
  })
  .catch((error) => {
    console.log("Erreur to connect mongodb");
  });
