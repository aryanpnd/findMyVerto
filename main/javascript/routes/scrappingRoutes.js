const express = require("express");
const { getStudentInfoScrapped, getStudentTimeTableScrapped } = require("../controller/scrappingControler");
const ScrappingRoutes = express.Router();

ScrappingRoutes.post("/getStudentInfo", getStudentInfoScrapped)
ScrappingRoutes.post("/getStudentTimeTable", getStudentTimeTableScrapped)

module.exports = { ScrappingRoutes };