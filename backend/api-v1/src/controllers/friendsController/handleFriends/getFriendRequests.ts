import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { includingFields } from "../../../constants/friends";

export const getFriendRequests = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, page = 1, limit = 15, count } = req.body;

        // First query: Fetch only the friendRequests field to compute the total count
        const userFull = await Student.findOne({ reg_no, password }).select("friendRequests");
        if (!userFull) {
            return res.status(200).json({
                friendRequests: [],
                message: "User not found",
                errorMessage: "Invalid credentials",
                success: false,
            });
        }

        const totalRequests = userFull.friendRequests.length;
        const totalPages = Math.ceil(totalRequests / limit);

        // If count flag is true, return only the count details.
        if (count) {
            return res.status(200).json({
                totalRequests,
                totalPages,
                message: "Friend requests count fetched successfully",
                success: true,
            });
        }

        // Otherwise, perform a second query to fetch the paginated friend requests with details.
        const userWithRequests = await Student.findOne({ reg_no, password })
            .populate({
                path: "friendRequests",
                select: includingFields,
                options: {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit as any),
                },
            });

        res.status(200).json({
            friendRequests: userWithRequests?.friendRequests || [],
            totalRequests,
            totalPages,
            currentPage: page,
            message: "Friend requests fetched successfully",
            success: true,
        });
    } catch (error: any) {
        res.status(500).json({
            friendRequests: [],
            message: "Internal Server Error",
            success: false,
            errorMessage: error.message,
        });
    }
};
