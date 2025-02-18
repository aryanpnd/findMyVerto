import { FriendBody, umsLoginReturn } from "../../types/scrapperTypes";
import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";
import { scrapeStudentMessages } from "../../scrapper/studentMessagesScrapper";


export const getStudentMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reg_no, password, pageIndex, subject, description } = req.body;

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

        const studentMessages = await scrapeStudentMessages(login.cookie, pageIndex, subject, description);

        if (!studentMessages.success || !studentMessages.data) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentMessages.message || "Failed to fetch messages",
                lastSynced: new Date().toISOString(),
                errorMessage: studentMessages.errorMessage || "Invalid messages data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentMessages.data,
            message: "Successfully fetched messages",
            lastSynced: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            summary: {},
            message: "Internal server error",
            success: false,
            errorMessage: "Internal server error",
        });
    }
}