const express = require("express");
const { getStudentInfoScrapped, getStudentTimeTableScrapped } = require("../controller/scrappingControler");
const ScrappingRoutes = express.Router();

ScrappingRoutes.get("/getStudentInfo", getStudentInfoScrapped)
ScrappingRoutes.get("/getStudentTimeTable", getStudentTimeTableScrapped)

module.exports = { ScrappingRoutes };