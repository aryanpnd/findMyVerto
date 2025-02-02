import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { TimeTable } from "../../../models/studentTimetableModel";
import { getStudentTimeTable } from "../../studentController/studentTimetableController";

export const getFriendTimetable = async (req: Request, res: Response) => {
  try {
    const { reg_no, password, studentId, sync } = req.body;

    const student = await Student.findOne({ reg_no, password });
    if (!student) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Student not found",
        errorMessage: "Invalid credentials",
      });
    }

    const isStudentInFriendList = student.friends.some((std) => std.equals(studentId));
    if (!isStudentInFriendList) {
      return res.status(403).json({
        success: false,
        data: {},
        message: "Not friends",
      });
    }

    const friend = await Student.findById(studentId);
    if (!friend) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Friend not found",
      });
    }

    if (friend.allowedFieldsToShow.includes("timetable") === false) {
      return res.status(403).json({
        success: false,
        data: {},
        message: "Not allowed",
        errorMessage: "Your friend has made his timetable private",
      });
    }

    if (!sync) {
      const friendTimetable = await TimeTable.findOne({ reg_no: friend.reg_no });
      if (friendTimetable) {
        return res.status(200).json({
          success: true,
          data: friendTimetable.data,
          lastSynced: new Date().toISOString(),
          message: "Friend timetable fetched successfully",
        });
      }
      return res.status(404).json({
        success: false,
        data: {},
        message: "Friend timetable not found",
      });
    }

    if (friend.reg_no && friend.password) {
      const friendBody = { reg_no: friend.reg_no, password: friend.password };
      return getStudentTimeTable(req, res, friendBody);
    }

    res.status(400).json({
      success: false,
      data: {},
      message: "Friend credentials are missing",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: {},
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
};
