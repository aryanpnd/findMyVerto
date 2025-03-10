import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { includingFields } from "../../../constants/friends";

export const getSentFriendRequests = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, page = 1, limit = 15 } = req.body;

        // First query: Get only the total count of sent friend requests
        const userFull = await Student.findOne({ reg_no, password }).select("sentFriendRequests");
        if (!userFull) {
            return res.status(200).json({
                sentFriendRequests: [],
                message: "User not found",
                errorMessage: "Invalid credentials",
                success: false,
            });
        }

        const totalRequests = userFull.sentFriendRequests.length;
        const totalPages = Math.ceil(totalRequests / limit);

        // Second query: Fetch the paginated sent friend requests with details
        const userWithRequests = await Student.findOne({ reg_no, password })
            .populate({
                path: "sentFriendRequests",
                select: includingFields,
                options: {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit as any),
                },
            });

        res.status(200).json({
            sentFriendRequests: userWithRequests?.sentFriendRequests || [],
            totalRequests,
            totalPages,
            currentPage: page,
            message: "Sent friend requests fetched successfully",
            success: true,
        });
    } catch (error: any) {
        res.status(500).json({
            sentFriendRequests: [],
            message: "Internal Server Error",
            success: false,
            errorMessage: error.message,
        });
    }
};
