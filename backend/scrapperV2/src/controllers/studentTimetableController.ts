import { Request, Response } from "express";
import { scrapeStudentTimetable } from "../scrapper/studentTimetableScrapper";
import { saveStudentTimeTable } from "../services/saveToDB/studentTimetable";
import { StudentTimeTable } from "../types/DB_ServicesTypes";

export const getStudentTimeTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    const studentTimetable = await scrapeStudentTimetable({ reg_no, password });

    // Check if scraping was successful
    if (!studentTimetable.status || !studentTimetable.data || !('time_table' in studentTimetable.data)) {
      res.status(400).json({
        status: false,
        data: {},
        message: studentTimetable.message || "Failed to fetch timetable",
        requestTime: new Date().toISOString(),
        errorMessage: studentTimetable.errorMessage || "Invalid timetable data"
      });
      return;
    }

    // Prepare data for saving
    const studentTimetableTemp: StudentTimeTable = {
      reg_no: reg_no,
      data: studentTimetable.data,
      requestTime: studentTimetable.requestTime
    };

    // Save to database
    const saveResult = await saveStudentTimeTable(studentTimetableTemp);
    if (!saveResult.status) {
      res.status(400).json({
        status: false,
        data: {},
        message: "Failed to save student data",
        requestTime: new Date().toISOString(),
        errorMessage: saveResult.message
      });
      return;
    }

    // Send successful response
    res.status(200).json(studentTimetable);

  } catch (error: any) {
    res.status(500).json({
      data: {},
      requestTime: new Date().toISOString(),
      message: "Unable to fetch the data",
      status: false,
      errorMessage: error.message
    });
  }
};