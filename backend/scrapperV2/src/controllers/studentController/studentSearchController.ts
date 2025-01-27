import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const searchStudent = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.q as string;
        if (!searchQuery) {
            res.status(400).json({
                data: [],
                requestTime: new Date().toISOString(),
                message: "Invalid search query",
                status: false,
                errorMessage: "Invalid search query"
            });
            return;
        }

        const searchLogic = {
            $or: [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { reg_no: { $regex: new RegExp(searchQuery, "i") } },
                { section: { $regex: new RegExp(searchQuery, "i") } },
            ],
        };

        const students = await Student.find(searchLogic).select({
            section: 1, 
            name: 1, 
            reg_no: 1, 
            studentPicture: 1, 
            _id: 1
        });

        if (students.length === 0) {
            res.status(404).json({
                data: [],
                requestTime: new Date().toISOString(),
                message: "No student found",
                status: false,
                errorMessage: "No student found"
            });
            return;
        }

        res.status(200).json({
            data: students,
            requestTime: new Date().toISOString(),
            message: "Student found",
            status: true,
            errorMessage: ""
        });

    } catch (error: any) {
        res.status(500).json({
            data: [],
            requestTime: new Date().toISOString(),
            message: "Unable to fetch the data",
            status: false,
            errorMessage: error.message
        });
    }
};
