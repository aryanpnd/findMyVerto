import { FriendBody } from "../../types/scrapperTypes";
import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";
import { umsLoginReturn } from "../../types/scrapperTypes";
import { studentMyDrivesScrapper } from "../../scrapper/studentMyDrivesScrapper";
import { placementLogin } from "../../scrapper/placementPortalLogin";


export const getStudentMyDrives = async (req: Request, res: Response, friendBody?: FriendBody): Promise<void> => {
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

        const login: umsLoginReturn = await placementLogin({ reg_no, password });

        if (!login.login) {
            res.status(200).json({
                data:{},
                message: "Failed to login",
                success: false,
                errorMessage: login.message || "Invalid credentials"
            });
            return;
        }
        const studentMyDrives = await studentMyDrivesScrapper(login.cookie);

        if (!studentMyDrives.success || !studentMyDrives.data) {
            res.status(200).json({
                success: false,
                data: {},
                message: studentMyDrives.message || "Failed to fetch my drives",
                lastSynced: new Date().toISOString(),
                errorMessage: studentMyDrives.errorMessage || "Invalid my drives data",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: studentMyDrives.data,
            message: "Successfully fetched my drives",
            lastSynced: new Date().toISOString(),
        });
    } catch (error:any) {
        res.status(500).json({
            success: false,
            data: {},
            message: "Failed to fetch my drives",
            lastSynced: new Date().toISOString(),
            errorMessage: error.message || "Internal server error",
        });
    }
}