import { Request, Response } from "express";
import { Student } from "../../models/studentModel";
import { error } from "console";

const excludingFields = { password: 0, friendRequests: 0, sentFriendRequests: 0, friends: 0 };

export const getFriendList = async (req: Request, res: Response) => {
    try {
        const { reg_no, password } = req.body;
        const user = await Student.findOne({ reg_no: reg_no, password: password })
            .populate("friends", { ...excludingFields })
        if (user) {
            res.status(200).json({
                friends: user.friends,
                message: "Friends fetched successfully",
                success: true,
            })
        } else {
            res.status(200).json({
                friends: [],
                message: "User not found",
                errorMessage: "Inavid credentials",
                success: false,
            })
        }
    } catch (error: any) {
        res.status(500).json({
            friends: [],
            message: "Internal Server Error",
            success: false,
            errorMessage: error.message,
        })
    }
}