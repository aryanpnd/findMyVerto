import { Request, Response } from "express";
import { scrapeStudentTimetable } from "../../scrapper/studentTimetableScrapper";
import { saveStudentTimeTable } from "../../services/saveToDB/studentTimetable";
import { StudentTimeTable } from "../../types/DB_ServicesTypes";
import { FriendBody } from "../../types/scrapperTypes";

export const getStudentTimeTable = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
  try {
    const requestBody = friendBody || req.body;

    // Ensure request body is valid
    if (!requestBody || typeof requestBody !== "object") {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        lastSynced: new Date().toISOString(),
      });
      return;
    }

    const { reg_no, password } = requestBody;

    // Validate required fields
    if (!reg_no || !password) {
      res.status(400).json({
        success: false,
        message: "Registration number and password are required",
        lastSynced: new Date().toISOString(),
      });
      return;
    }

    const studentTimetable = await scrapeStudentTimetable({ reg_no, password });

    if (!studentTimetable.success || !studentTimetable.data || !("time_table" in studentTimetable.data)) {
      res.status(400).json({
        success: false,
        data: {},
        message: studentTimetable.message || "Failed to fetch timetable",
        lastSynced: new Date().toISOString(),
        errorMessage: studentTimetable.errorMessage || "Invalid timetable data",
      });
      return;
    }

    const studentTimetableTemp: StudentTimeTable = {
      reg_no,
      data: studentTimetable.data,
      lastSynced: studentTimetable.lastSynced,
    };

    const saveResult = await saveStudentTimeTable(studentTimetableTemp);
    if (!saveResult.success) {
      res.status(400).json({
        success: false,
        data: {},
        message: "Failed to save student data",
        lastSynced: new Date().toISOString(),
        errorMessage: saveResult.message,
      });
      return;
    }

    res.status(200).json(studentTimetable);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      data: {},
      lastSynced: new Date().toISOString(),
      message: "Unable to fetch the data",
      success: false,
      errorMessage: error.message,
    });
  }
};
