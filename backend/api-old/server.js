require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { StudentRoutes } = require("./routes/studentRoutes");
const { AuthRoutes } = require("./routes/authRoutes");
const { authenticate } = require("./controller/auth");

// initializing express
const app = express();

// initializing app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connection to database
mongoose
  .connect(
    process.env.DBURL
  )
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Error while connecting to DB");
  });

// ping the server to receive a pong
app.get('/ping', (req, res) => {
  res.send('pong');
});

// rest apis
app.use("/api/auth/", AuthRoutes);
app.use("/api/student/", authenticate,StudentRoutes);

// handling main and auth page not found routes
app.get("/*", (req, res) => {
  res.status(200).send("Welcome to FindMyVerto");
});

// declaring express listener
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
