require("dotenv").config();
const express = require("express");
const { ScrappingRoutes } = require("./routes/scrappingRoutes");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/scrap", ScrappingRoutes);

// handling main and auth page not found routes
app.get("/*", (req, res) => {
  res.status(200).send("Welcome to FindMyVerto");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Scrapper server started on port ${PORT}`);
});