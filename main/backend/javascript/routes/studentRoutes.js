const express = require("express");
const { getStudentInfo, getStudentTimeTable, getStudentAttendance } = require("../controller/studentController");
const StudentRoutes = express.Router();

StudentRoutes.post("/getStudentInfo", getStudentInfo)
StudentRoutes.post("/getStudentTimeTable", getStudentTimeTable)
StudentRoutes.post("/getStudentAttendance", getStudentAttendance)

module.exports = { StudentRoutes };