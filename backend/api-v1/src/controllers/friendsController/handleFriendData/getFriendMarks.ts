import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { getStudentCgpa } from "../../studentController/getStudentCgpaController";

export const getFriendCgpa = async (req: Request, res: Response) => {
try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no, password });
        if (!student) {
            return res.status(404).json({
                data: {},
                message: "Student not found",
                success: false,
                errorMessage: "Invalid credentials",
            });
        }

        const isStudentInFriendList = student.friends.some((std) => std.equals(studentId));
        if (!isStudentInFriendList) {
            return res.status(403).json({
                data: {},
                message: "Not friends",
                success: false,
                errorMessage: "Not friends",
            });
        }

        const friend = await Student.findById(studentId);
        if (!friend) {
            return res.status(404).json({
                data: {},
                message: "Friend not found",
                success: false,
                errorMessage: "Friend not found",
            });
        }

        if(friend.allowedFieldsToShow.includes("marks") === false){
            return res.status(200).json({
                data: {},
                message: "Not allowed",
                success: false,
                errorMessage: "Your friend has made his marks private",
            });
        }

        if (friend.reg_no && friend.password) {
            const friendBody = { reg_no: friend.reg_no, password: friend.password };
            return getStudentCgpa(req, res, friendBody);
        }

        res.status(200).json({
            data: {},
            message: "Invalid friend data",
            success: false,
            errorMessage: "Invalid friend data",
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            summary: {},
            details: {},
            message: "Unexpected server error",
            success: false,
            errorMessage: error.message,
        });
    }
}