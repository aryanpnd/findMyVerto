import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const getFriendRequests = async (req: Request, res: Response) => {
    try {
        const { reg_no, password } = req.body;
        const user = await Student.findOne({ reg_no: reg_no, password: password })
            .populate("friendRequests", { imageURL: 1, name: 1, reg_no: 1, section: 1, rollNumber: 1 })
            .select({ _id: 0, friendRequests: 1 })
        if (user) {
            res.status(200).json({
                friendRequests: user.friendRequests,
                message: "Friend Requests fetched successfully",
                status: true,
            })
        } else {
            res.status(200).json({
                friendRequests: [],
                message: "User not found",
                status: false,
            })
        }
    } catch (e: any) {
        res.status(500).json({
            friendRequests: [],
            message: "Internal Server Error",
            status: false,
            errorMessage: e.message,
        })
    }
}