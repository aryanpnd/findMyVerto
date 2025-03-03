import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { sendPushNotification } from "../../../utils/notifications";
import { avatarUrl } from "../../../constants/notifications";

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no, password });

        // Check if the student is valid
        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Wrong credentials",
            });
        }

        // Prevent sending request to oneself
        if (student.id === studentId) {
            return res.status(200).json({
                success: false,
                message: "You can't send a request to yourself",
            });
        }

        // Check if already friends or request already sent
        const isStudentInFriendList = student.friends.some(std => std.equals(studentId));
        const isStudentInSentList = student.sentFriendRequests.some(std => std.equals(studentId));

        if (isStudentInFriendList) {
            return res.status(200).json({
                success: false,
                message: "Already friends",
            });
        }

        if (isStudentInSentList) {
            return res.status(200).json({
                success: false,
                message: "Friend request already sent",
            });
        }

        // Fetch the student to whom the request is being sent
        const toSendfrndReqStudent = await Student.findById(studentId);

        if (!toSendfrndReqStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Update friend request lists and save
        toSendfrndReqStudent.friendRequests.push(student.id);
        await toSendfrndReqStudent.save();

        student.sentFriendRequests.push(toSendfrndReqStudent.id);
        await student.save();

        if(toSendfrndReqStudent.devicePushToken) {
            sendPushNotification(
                "Friend request",
                `${student.name} sent you a friend request`,
                toSendfrndReqStudent.devicePushToken,
                student.studentPicture || avatarUrl(student.name?.split(" ")[0] || "A"),
            );
        }

        return res.status(200).json({
            success: true,
            message: "Friend request sent successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errorMessage: error.message,
        });
    }
};
