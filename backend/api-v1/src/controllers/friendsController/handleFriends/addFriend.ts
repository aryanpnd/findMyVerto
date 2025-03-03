import { Request, Response } from "express";
import { Student } from "../../../models/studentModel";
import { avatarUrl } from "../../../constants/notifications";
import { sendPushNotification } from "../../../utils/notifications";

export const addFriend = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no: reg_no, password: password });
        if (!student) {
            return res.status(404).send({ success: false, message: "Invalid credentials" });
        }

        // to check if the student (of whome accept the friend req) is already present in its friend list or not 
        const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

        // to check if the student (to whome accept the friend req) is already present in its request list or not 
        const isStudentInRequestList = student.friendRequests.some(std => std.equals(studentId));

        if (!isStudentInFriendList && isStudentInRequestList) {
            // searching the student to whome add to friend
            Student.findById(studentId)
                .then(toAcceptfrndReqStudent => {
                    if (toAcceptfrndReqStudent) {
                        // saving the student into student friend list and removing us from its sentRequestList list
                        toAcceptfrndReqStudent.friends.push(student.id)
                        toAcceptfrndReqStudent.sentFriendRequests = toAcceptfrndReqStudent.sentFriendRequests.filter(id => !id.equals(student.id))
                        toAcceptfrndReqStudent.friendRequests = toAcceptfrndReqStudent.friendRequests.filter(id => !id.equals(student.id))
                        toAcceptfrndReqStudent.save()
                            .then(() => {
                                // saving the student (to whome add to friend) into student friend list
                                student.friends.push(toAcceptfrndReqStudent.id)
                                student.friendRequests = student.friendRequests.filter(id => !id.equals(toAcceptfrndReqStudent.id))
                                student.sentFriendRequests = student.sentFriendRequests.filter(id => !id.equals(toAcceptfrndReqStudent.id))
                                student.save()
                                    .then(() => {
                                        if(toAcceptfrndReqStudent.devicePushToken){
                                            sendPushNotification(
                                                "Friend request accepted",
                                                `${student.name} accepted your friend request`,
                                                toAcceptfrndReqStudent.devicePushToken,
                                                student.studentPicture || avatarUrl(student.name?.split(" ")[0] || "A")
                                            );
                                        }
                                        res.status(200).send({
                                            success: true,
                                            message: "Friend added"
                                        });
                                    })
                                    .catch((e) => {
                                        res.status(500).send({
                                            success: false,
                                            message: "Error while accepting Friend request",
                                            errorMessage: e.message
                                        })
                                    })
                                return
                            })
                            .catch((e) => {
                                res.status(500).send({
                                    success: false,
                                    message: "Error while accepting Friend request",
                                    errorMessage: e.message
                                })
                            })
                        return
                    } else {
                        res.status(404).send({ success: false, message: "Student not found" });
                    }
                })
        }
        else if (isStudentInFriendList) {
            res.send({ success: true, message: 'Already friends' });
        }
        else {
            res.send({ success: false, message: "Friend is not in request list" })
        }

    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            errorMessage: e.message
        })
    }
}