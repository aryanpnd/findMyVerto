const express = require('express');
const { getStudentInfo, getStudentTimeTable, getStudentAttendance } = require('../controllers/getStudentData');

const ScrappingRoutes = express.Router();

ScrappingRoutes.post("/getStudentInfo", getStudentInfo);
ScrappingRoutes.post("/getStudentTimeTable", getStudentTimeTable);
ScrappingRoutes.post("/getStudentAttendance", getStudentAttendance);

module.exports = { ScrappingRoutes };