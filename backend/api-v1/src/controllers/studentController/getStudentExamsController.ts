import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";
import { FriendBody, umsLoginReturn } from "../../types/scrapperTypes";
import { scrapeStudentExams } from "../../scrapper/studentExamsScrapper";

export const getStudentExams = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
    try {
        const requestBody = friendBody || req.body;

        if (!requestBody || typeof requestBody !== "object") {
            res.status(200).json({
                success: false,
                data: {},
                message: "Invalid request data",
                lastSynced: new Date().toISOString(),
            });
            return;
        }

        const { reg_no, password } = requestBody;

        // Validate required fields
        if (!reg_no || !password) {
            res.status(200).json({
                success: false,
                data: {},
                message: "Registration number and password are required",
                lastSynced: new Date().toISOString(),
            });
            return;
        }

        const login: umsLoginReturn = await umsLogin({ reg_no, password });

        if (!login.login) {
            res.status(200).json({
                data:{},
                message: "Failed to login",
                success: false,
                errorMessage: login.message || "Invalid credentials"
            });
            return;
        }
        const studentExams = await scrapeStudentExams(login.cookie);

        if (!studentExams.success || !studentExams.data) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentExams.message || "Failed to fetch exams",
                lastSynced: new Date().toISOString(),
                errorMessage: studentExams.errorMessage || "Invalid exams data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentExams.data,
            message: "Successfully fetched exams",
            lastSynced: new Date().toISOString(),
        });
    } catch (error:any) {
        res.status(500).json({
            success: false,
            data: {},
            message: "Internal server error",
            lastSynced: new Date().toISOString(),
            errorMessage: error.message || "An error occurred",
        });
    }
}