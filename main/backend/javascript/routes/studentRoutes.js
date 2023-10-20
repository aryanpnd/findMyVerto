const express = require("express");
const { getStudentInfo, getStudentTimeTable, getStudentAttendance, searchStudents } = require("../controller/studentController");
const { getFriendList, getFriendRequests, getSentFriendRequests, sendFriendRequest, addFriend, removeFriend, removeFromRequest, cancelRequest, getFriendData } = require("../controller/friendsControler");
const StudentRoutes = express.Router();

// StudentRoutes.post("/getStudentInfo", getStudentInfo)
StudentRoutes.post("/searchStudents", searchStudents)
StudentRoutes.post("/getStudentTimeTable", getStudentTimeTable)
StudentRoutes.post("/getStudentAttendance", getStudentAttendance)

//friend section
StudentRoutes.post("/getfriendData", getFriendData)
StudentRoutes.post("/getfriendList", getFriendList)
StudentRoutes.post("/getfriendList", getFriendList)
StudentRoutes.post("/getfriendRequests", getFriendRequests)
StudentRoutes.post("/getSentFriendRequests", getSentFriendRequests)
StudentRoutes.post("/sendFriendRequest", sendFriendRequest)
StudentRoutes.post("/addFriend", addFriend)
StudentRoutes.post("/cancelSentRequest", cancelRequest)
StudentRoutes.post("/removeFromFriendRequest", removeFromRequest)
StudentRoutes.post("/removeFriend", removeFriend)

module.exports = { StudentRoutes };