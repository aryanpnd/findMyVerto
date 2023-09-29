const express = require("express");
const { getStudentInfoScrapped } = require("../controller/scrappingControler");
const ScrappingRoutes = express.Router();

ScrappingRoutes.get("/getStudentInfo", getStudentInfoScrapped)

module.exports = { ScrappingRoutes };