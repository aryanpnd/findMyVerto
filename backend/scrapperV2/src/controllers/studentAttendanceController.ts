import { Request, Response } from "express";
import { scrapeAttendanceDetail, scrapeAttendanceSummary } from "../scrapper/studentAttendanceScrapper";
import { umsLogin } from "../services/umsLogin";
import { umsLoginReturn } from "../types/servicesReturnTypes";

/**
 * Get student attendance information asynchronously
 * @param req 
 * @param res 
 */
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    const login: umsLoginReturn = await umsLogin({ reg_no, password });

    if (!login.login) {
      res.status(401).json({
        summary: {},
        details: {},
        message: "Failed to login",
        status: false,
        errorMessage: login.message
      });
    }

    const studentAttendance = {
      summary: {},
      details: {},
      last_updated: new Date().toISOString(),
      message: "",
      status: false,
      errorMessage: ""
    }

    // Fetch attendance summary and detail in parallel
    const [summary, detail] = await Promise.all([
      scrapeAttendanceSummary(login.cookie),
      scrapeAttendanceDetail(login.cookie)
    ]);

    // Append the fetched data to the studentAttendance object
    studentAttendance.summary = summary;
    studentAttendance.details = detail;
    studentAttendance.message = "Data fetched successfully";
    studentAttendance.status = true;
    res.status(200).json(studentAttendance);
  } catch (error: any) {
    res.json({ 
      summary: {},
      details: {},
      last_updated: "",
      message: "Unable to fetch the data",
      status: false,
      errorMessage: error.message
     });
  }
};
