import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { includingFields } from "../../../constants/friends";

export const getFriendList = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, page = 1, limit = 20 } = req.body;

        // First, get the user to count total friends
        const userFull = await Student.findOne({ reg_no, password }).select("friends");
        if (!userFull) {
            return res.status(200).json({
                friends: [],
                message: "User not found",
                errorMessage: "Invalid credentials",
                success: false,
            });
        }
        const totalFriends = userFull.friends.length;
        const totalPages = Math.ceil(totalFriends / limit);

        // Now get the paginated friends list with the necessary fields
        const userWithFriends = await Student.findOne({ reg_no, password })
            .populate({
                path: "friends",
                select: includingFields,
                options: {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit as any),
                },
            });

        res.status(200).json({
            friends: userWithFriends?.friends || [],
            totalFriends,
            totalPages,
            currentPage: page,
            message: "Friends fetched successfully",
            success: true,
        });
    } catch (error: any) {
        res.status(500).json({
            friends: [],
            message: "Internal Server Error",
            success: false,
            errorMessage: error.message,
        });
    }
};
