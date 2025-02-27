import { scrapeStudentLeaveSlip } from "../../scrapper/studentResidentialScrapper";
import { FriendBody } from "../../types/scrapperTypes";
import { umsLogin } from "../../scrapper/umsLogin";
import { umsLoginReturn } from "../../types/scrapperTypes";
import { Request, Response } from "express";


export const getStudentLeaveSlip = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
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

        const studentLeaveSlip = await scrapeStudentLeaveSlip(login.cookie);

        if (!studentLeaveSlip) {
            res.status(200).json({
                success: false,
                data: {},
                message: "Failed to fetch leave slip",
                lastSynced: new Date().toISOString(),
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentLeaveSlip,
            message: "Successfully fetched leave slip",
            lastSynced: new Date().toISOString(),
        });
    }
    catch (error: any) {
        res.status(200).json({
            success: false,
            data: {},
            message: error.message,
            lastSynced: new Date().toISOString(),
        });
    }
}