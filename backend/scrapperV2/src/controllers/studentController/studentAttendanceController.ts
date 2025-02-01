import { Request, Response } from "express";
import { scrapeAttendanceDetail, scrapeAttendanceSummary } from "../../scrapper/studentAttendanceScrapper";
import { umsLogin } from "../../scrapper/umsLogin";
import { umsLoginReturn } from "../../types/scrapperTypes";

/**
 * Get student attendance information asynchronously
 * @param req 
 * @param res 
 */
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;

    if (!reg_no || !password) {
      res.status(200).json({
        summary: {},
        details: {},
        message: "Registration number and password are required",
        success: false,
        errorMessage: "Missing required fields"
      });
      return;
    }

    const login: umsLoginReturn = await umsLogin({ reg_no, password });

    if (!login.login) {
      res.status(200).json({
        summary: {},
        details: {},
        message: "Failed to login",
        success: false,
        errorMessage: login.message || "Invalid credentials"
      });
      return;
    }

    const studentAttendance = {
      summary: {},
      details: {},
      last_updated: new Date().toISOString(),
      message: "",
      success: false,
      errorMessage: ""
    };

    try {
      // Fetch attendance summary and detail in parallel
      const [summary, detail] = await Promise.all([
        scrapeAttendanceSummary(login.cookie),
        scrapeAttendanceDetail(login.cookie)
      ]);

      // Check if any of the responses has success: false
      if (!summary.success || !detail.success) {
        res.status(200).json({
          summary: {},
          details: {},
          message: "Failed to fetch attendance data",
          success: false,
          errorMessage: summary.errorMessage || detail.errorMessage || "Unknown error"
        });
        return;
      }

      // Append the fetched data to the studentAttendance object
      studentAttendance.summary = summary;
      studentAttendance.details = detail;
      studentAttendance.message = "Data fetched successfully";
      studentAttendance.success = true;

      res.status(200).json(studentAttendance);
    } catch (attendanceError: any) {
      console.error("Attendance fetch error:", attendanceError);
      res.status(500).json({
        summary: {},
        details: {},
        message: "Error while fetching attendance data",
        success: false,
        errorMessage: attendanceError.message || "Internal server error"
      });
    }

  } catch (error: any) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      summary: {},
      details: {},
      last_updated: "",
      message: "Unable to fetch the data",
      success: false,
      errorMessage: error.message || "An unexpected error occurred"
    });
  }
};
