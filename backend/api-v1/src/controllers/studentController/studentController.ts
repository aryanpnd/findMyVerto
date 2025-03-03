import { Request, Response } from "express";
import { scrapeStudentBasicInfo } from "../../scrapper/studentDetailsScrapper";
import { saveStudentDetails } from "../../services/saveToDB/studentDetails";
import { StudentDetails } from "../../types/DB_ServicesTypes";
import { Student } from "../../models/studentModel";

/**
 * Get student basic information
 * @param req 
 * @param res 
 */
export const getStudentBasicInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;

    const studentInfo = await scrapeStudentBasicInfo({ reg_no, password });
    if (!studentInfo.success) {
      res.status(200).json(studentInfo);
      return;
    }

    if (!("reg_no" in studentInfo.data)) {
      res.status(200).json({
        success: false,
        message: "Invalid student data",
        lastSynced: new Date().toISOString(),
        errorMessage: "Invalid student data",
      });
      return;
    }

    const studentDetails: StudentDetails = {
      ...studentInfo.data,
      name: studentInfo.data.studentName,
      reg_no,
      password,
      lastSync: new Date().toISOString()
    };

    if(req.body.devicePushToken) {
      studentDetails.devicePushToken = req.body.devicePush
    }

    // Save student details
    const saveStudent = await saveStudentDetails(studentDetails);
    if (!saveStudent.success) {
      res.status(200).json({
        success: false,
        message: "Failed to save student data",
        lastSynced: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.json({
      data: {},
      lastSynced: new Date().toISOString(),
      message: "Unable to fetch the data",
      errorMessage: error.message,
      success: false,
    });
  }
};

export const saveDevicePushToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no,password, devicePushToken } = req.body;

    const studentDetails = await Student.findOneAndUpdate( { reg_no, password }, { devicePushToken }, { new: true });

    if (!studentDetails) {
      res.status(200).json({
        success: false,
        message: "Student not found",
        lastSynced: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Device push token saved successfully",
      lastSynced: new Date().toISOString(),
    });

  }
  catch (error: any) {
    res.json({
      data: {},
      lastSynced: new Date().toISOString(),
      message: "Unable to save the device push token",
      errorMessage: error.message,
      success: false,
    });
  }
}

