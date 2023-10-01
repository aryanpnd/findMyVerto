require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ScrappingRoutes } = require("./routes/scrappingRoutes");
const { StudentRoutes } = require("./routes/studentRoutes");
const { AuthRoutes } = require("./routes/authRoutes");

// initializing express
const app = express();

// initializing app middlewares
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
app.use("/api/student/", StudentRoutes);
app.use("/api/auth/", AuthRoutes);

// handling main and auth page not found routes
app.get("/*", (req, res) => {
  res.status(404).send({"message":"not found"});
});

// declaring express listener
app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});