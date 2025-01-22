import { Request, Response } from "express";
import { scrapeStudentTimetable } from "../scrapper/studentTimetableScrapper";

/**
 * Get student basic information
 * @param req 
 * @param res 
 */
export const getStudentTimeTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    const studentInfo = await scrapeStudentTimetable({ reg_no, password });
    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.status(500).json(
      {
        data: {},
        requestTime: "",
        message: "Unable to fetch the data",
        status: false,
        errorMessage: error.message
      }
    );
  }
};