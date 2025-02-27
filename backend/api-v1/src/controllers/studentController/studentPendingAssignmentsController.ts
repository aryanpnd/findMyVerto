import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";
import { FriendBody, umsLoginReturn } from "../../types/scrapperTypes";
import { scrapeStudentPendingAssignments } from "../../scrapper/studentPendingAssignmentsScrapper";

export const getStudentPendingAssignments = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
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
        const studentAssignments = await scrapeStudentPendingAssignments(login.cookie);

        if (!studentAssignments.success || !studentAssignments.data) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentAssignments.message || "Failed to fetch assignments",
                lastSynced: new Date().toISOString(),
                errorMessage: studentAssignments.errorMessage || "Invalid assignments data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentAssignments.data,
            message: "Successfully fetched assignments",
            lastSynced: new Date().toISOString(),
        });
    } catch (error) {
        throw error;
    }
}