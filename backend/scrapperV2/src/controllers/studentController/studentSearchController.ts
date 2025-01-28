import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const searchStudent = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.q as string;
        if (!searchQuery) {
            res.status(400).json({
                students: [],
                requestTime: new Date().toISOString(),
                message: "Invalid search query",
                status: false,
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

        const students = await Student.find(searchLogic).select({
            section: 1,
            name: 1,
            reg_no: 1,
            studentPicture: 1,
            _id: 1
        });

        if (students.length === 0) {
            res.status(200).json({
                students: [],
                requestTime: new Date().toISOString(),
                message: "No student found",
                status: false,
                errorMessage: "No student found"
            });
            return;
        }

        if (req.query.r && req.query.p) {
            const friendRequests = [];
            const friendList = [];
            const sentFriendRequests = [];
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
                    students: students,
                    friendRequests: friendRequests,
                    friends: friendList,
                    sentFriendRequests: sentFriendRequests,
                    requestTime: new Date().toISOString(),
                    message: "Student found",
                    status: true,
                    errorMessage: ""
                });
                return
            } else {
                res.status(200).json({
                    friendRequests: [],
                    message: "User not found",
                    errorMessage: "Invalid credentials",
                    status: false,
                })
                return
            }
        }

        res.status(200).json({
            students: students,
            requestTime: new Date().toISOString(),
            message: "Student found",
            status: true,
            errorMessage: ""
        });

    } catch (error: any) {
        res.status(500).json({
            students: [],
            requestTime: new Date().toISOString(),
            message: "Unable to fetch the students",
            status: false,
            errorMessage: error.message
        });
    }
};
