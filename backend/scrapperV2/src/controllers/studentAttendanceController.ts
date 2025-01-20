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
      throw new Error('Failed to login: ' + login.message);
    }

    const studentAttendance = {
      summary: {},
      detail: {},
      last_updated: new Date().toISOString() // Setting the current timestamp
    };

    // Fetch attendance summary and detail in parallel
    const [summary, detail] = await Promise.all([
      scrapeAttendanceSummary(login.cookie),
      scrapeAttendanceDetail(login.cookie)
    ]);

    // Append the fetched data to the studentAttendance object
    studentAttendance.summary = summary;
    studentAttendance.detail = detail;

    res.status(200).json(studentAttendance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
