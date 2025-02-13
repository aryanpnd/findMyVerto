import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const setStudentAllowedFields = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, fields } = req.body;

        const student = await Student.findOne({ reg_no, password });
        if (!student) {
            return res.status(200).json({
                success: false,
                data: [],
                message: "Student not found",
                errorMessage: "Invalid credentials",
            });
        }

        student.allowedFieldsToShow = fields;
        await student.save();

        res.status(200).json({
            success: true,
            data: student.allowedFieldsToShow,
            message: "Allowed fields updated successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            data: [],
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
}


export const getStudentAllowedFields = async (req: Request, res: Response) => {
    try {
        const { reg_no, password } = req.body;

        const student = await Student.findOne({ reg_no, password });
        if (!student) {
            return res.status(200).json({
                success: false,
                data: [],
                message: "Student not found",
                errorMessage: "Invalid credentials",
            });
        }

        res.status(200).json({
            success: true,
            data: student.allowedFieldsToShow,
            message: "Allowed fields fetched successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            data: [],
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
}