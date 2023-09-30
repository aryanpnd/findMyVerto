const express = require("express");
const { getStudentInfo, getStudentTimeTable } = require("../controller/studentController");
const StudentRoutes = express.Router();

StudentRoutes.post("/getStudentInfo", getStudentInfo)
StudentRoutes.post("/getStudentTimeTable", getStudentTimeTable)

module.exports = { StudentRoutes };