const express = require("express");
const { getStudentInfo, getStudentTimeTable, getStudentAttendance, searchStudents } = require("../controller/studentController");
const { getFriendList, getFriendRequests, getSentFriendRequests, addFriend } = require("../controller/friendsControler");
const StudentRoutes = express.Router();

StudentRoutes.post("/getStudentInfo", getStudentInfo)
StudentRoutes.post("/searchStudents", searchStudents)
StudentRoutes.post("/getStudentTimeTable", getStudentTimeTable)
StudentRoutes.post("/getStudentAttendance", getStudentAttendance)

//friend section
StudentRoutes.post("/getfriendList", getFriendList)
StudentRoutes.post("/getfriendRequests", getFriendRequests)
StudentRoutes.post("/getSentFriendRequests", getSentFriendRequests)
StudentRoutes.post("/addFriend", addFriend)

module.exports = { StudentRoutes };