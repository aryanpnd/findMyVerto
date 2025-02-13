import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";

export const getSentFriendRequests = async (req: Request, res: Response) => {
    try {
        const { reg_no, password } = req.body;
        const user = await Student.findOne({ reg_no: reg_no, password: password })
            .populate("sentFriendRequests", { studentPicture: 1, name: 1, reg_no: 1, section: 1, rollNumber: 1 })
            .select({ _id: 0, sentFriendRequests: 1 })
        if (user) {
            res.status(200).json({
                sentFriendRequests: user.sentFriendRequests,
                message: "Sent Friend Requests fetched successfully",
                success: true,
            })
        } else {
            res.status(200).json({
                sentFriendRequests: [],
                message: "User not found",
                success: false,
            })
        }
    } catch (e: any) {
        res.status(500).json({
            sentFriendRequests: [],
            message: "Internal Server Error",
            success: false,
            errorMessage: e.message,
        })
    }
}