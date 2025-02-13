import { Request, Response } from "express";
import { FriendBody, umsLoginReturn } from "../../types/scrapperTypes";
import { umsLogin } from "../../scrapper/umsLogin";
import { scrapeStudentCgpa } from "../../scrapper/studentCgpaScrapper";

export const getStudentCgpa = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
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
        const studentCgpa = await scrapeStudentCgpa(login.cookie);

        if (!studentCgpa.success || !studentCgpa.data) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentCgpa.message || "Failed to fetch cgpa",
                lastSynced: new Date().toISOString(),
                errorMessage: studentCgpa.errorMessage || "Invalid cgpa data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentCgpa.data,
            message: "Successfully fetched cgpa",
            lastSynced: new Date().toISOString(),
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            data: {},
            message: "Unexpected server error",
            errorMessage: error.message,
        });
    }
}