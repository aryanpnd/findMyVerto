import { Request, Response } from "express";
import { FriendBody, umsLoginReturn } from "../../types/scrapperTypes";
import { umsLogin } from "../../scrapper/umsLogin";
import { scrapeStudentMarks } from "../../scrapper/studentMarksScrapper";

export const getStudentMarks = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
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
                data: {},
                message: "Failed to login",
                success: false,
                errorMessage: login.message || "Invalid credentials"
            });
            return;
        }
        const studentMarks = await scrapeStudentMarks(login.cookie);

        if (!studentMarks.success || !studentMarks.data ) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentMarks.message || "Failed to fetch marks",
                lastSynced: new Date().toISOString(),
                errorMessage: studentMarks.errorMessage || "Invalid marks data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentMarks.data,
            message: "Successfully fetched marks",
            lastSynced: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error(error);
        res.status(200).json({
            success: false,
            data: {},
            message: "Unexpected server error",
            lastSynced: new Date().toISOString(),
            errorMessage: error.message,
        });
    }
}
