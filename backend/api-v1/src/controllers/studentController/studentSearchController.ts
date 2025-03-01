import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

const PAGE_LIMIT = 20;
const PAGE_NUMBER = 1;

/**
 * Search student
 * @param req 
 * @param res 
 */
export const searchStudent = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.q as string;
        if (!searchQuery) {
            res.status(200).json({
                students: [],
                totalStudents: 0,
                totalPages: 0,
                currentPage: 1,
                lastSynced: new Date().toISOString(),
                message: "Invalid search query",
                success: false,
                errorMessage: "Invalid search query"
            });
            return;
        }

        const searchLogic = {
            $or: [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { reg_no: { $regex: new RegExp(searchQuery, "i") } },
                { section: { $regex: new RegExp(searchQuery, "i") } },
            ],
        };

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || PAGE_LIMIT;
        const skip = (page - 1) * limit;

        const totalStudents = await Student.countDocuments(searchLogic);
        if (totalStudents === 0) {
            res.status(200).json({
                students: [],
                totalStudents,
                totalPages: 0,
                currentPage: page,
                lastSynced: new Date().toISOString(),
                message: "No student found",
                success: false,
                errorMessage: "No student found"
            });
            return;
        }

        // Fetch students with pagination
        const students = await Student.find(searchLogic)
            .skip(skip)
            .limit(limit)
            .select({
                section: 1,
                name: 1,
                reg_no: 1,
                studentPicture: 1,
                _id: 1
            });

        // Calculate total pages
        const totalPages = Math.ceil(totalStudents / limit);

        // Check for additional user data (friend requests, friends, etc.)
        if (req.query.r && req.query.p) {
            const friendRequests: any[] = [];
            const friendList: any[] = [];
            const sentFriendRequests: any[] = [];
            const user = await Student.findOne({ reg_no: req.query.r, password: req.query.p })
                .populate("friendRequests", { studentPicture: 1, name: 1, reg_no: 1, section: 1, rollNumber: 1 })
                .populate("friends", { studentPicture: 1, name: 1, reg_no: 1, section: 1, rollNumber: 1 })
                .populate("sentFriendRequests", { studentPicture: 1, name: 1, reg_no: 1, section: 1, rollNumber: 1 })
                .select({ _id: 0, friendRequests: 1, friends: 1, sentFriendRequests: 1 });
            if (user) {
                friendRequests.push(...user.friendRequests);
                friendList.push(...user.friends);
                sentFriendRequests.push(...user.sentFriendRequests);
                res.status(200).json({
                    students,
                    friendRequests,
                    friends: friendList,
                    sentFriendRequests,
                    totalStudents,
                    totalPages,
                    currentPage: page,
                    lastSynced: new Date().toISOString(),
                    message: "Student found",
                    success: true,
                    errorMessage: ""
                });
                return;
            } else {
                res.status(200).json({
                    friendRequests: [],
                    message: "User not found",
                    errorMessage: "Invalid credentials",
                    success: false,
                });
                return;
            }
        }

        res.status(200).json({
            students,
            totalStudents,
            totalPages,
            currentPage: page,
            lastSynced: new Date().toISOString(),
            message: "Student found",
            success: true,
            errorMessage: ""
        });
    } catch (error: any) {
        res.status(500).json({
            students: [],
            totalStudents: 0,
            totalPages: 0,
            currentPage: 1,
            lastSynced: new Date().toISOString(),
            message: "Unable to fetch the students",
            success: false,
            errorMessage: error.message
        });
    }
};
