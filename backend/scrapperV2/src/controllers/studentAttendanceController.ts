import { Request, Response } from "express";
import { scrapeStudentAttendance } from "../scrapper/studentAttendanceScrapper";

/**
 * Get student basic information
 * @param req 
 * @param res 
 */
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reg_no, password } = req.body;
      const studentInfo = await scrapeStudentAttendance({reg_no, password});
      res.status(200).json(studentInfo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };