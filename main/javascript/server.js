require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ScrappingRoutes } = require("./routes/scrappingRoutes");
// initializing express
const app = express();

// initializing app middlewares
// app.use(
//   cors({
//     origin: "http://localhost:3000", // allow to server to accept request from different origin
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, // allow session cookie from browser to pass through
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connection to database
mongoose
  .connect(
    "mongodb+srv://hackergod9870:RgPygwPjdRe7Dg1G@cluster0.hced8n0.mongodb.net/?retryWrites=true&w=majority"
    // "mongodb://127.0.0.1:27017/ecommerce"
  )
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Error while connecting to DB");
  });


// rest apis
app.use("/api/scrap/", ScrappingRoutes);

// handling main and auth page not found routes
app.get("/*", (req, res) => {
  res.status(404).send({"message":"not found"});
});

// declaring express listener
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});