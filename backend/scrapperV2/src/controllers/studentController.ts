import { Request, Response } from "express";
import { scrapeStudentBasicInfo } from '../scrapper/studentDetailsScrapper';
import { saveStudentDetails } from "../services/saveToDB/studentDetails";
import { StudentDetails } from "../types/DB_ServicesTypes";

/**
 * Get student basic information
 * @param req 
 * @param res 
 */
export const getStudentBasicInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;

    const studentInfo = await scrapeStudentBasicInfo({ reg_no, password });
    if (!studentInfo.status) {
      res.status(400).json(studentInfo);
      return;
    }

    if (!('reg_no' in studentInfo.data)) {
      res.status(400).json({
        status: false,
        message: "Invalid student data",
        requestTime: new Date().toISOString(),
        errorMessage: "Invalid student data",
      });
      return;
    }

    const studentDetails: StudentDetails = {
      ...studentInfo.data,
      name: studentInfo.data.studentName,
      reg_no: studentInfo.data.reg_no,
      password: password,
      lastSync: new Date().toISOString()
    };

    const saveStudent = await saveStudentDetails(studentDetails);
    if (!saveStudent.status) {
      res.status(400).json({
        status: false,
        message: "Failed to save student data",
        requestTime: new Date().toISOString()
      });
      return;
    }

    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.json({
      data: {},
      requestTime: new Date().toISOString(),
      message: "Unable to fetch the data",
      errorMessage: error.message,
      status: true
    });
  }
};

