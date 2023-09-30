const express = require("express");
const { studentLogin, studentSignup } = require("../controller/authRoutes");

const AuthRoutes = express.Router();

AuthRoutes.post("/login", studentLogin)
AuthRoutes.post("/signup", studentSignup)

module.exports = { AuthRoutes };