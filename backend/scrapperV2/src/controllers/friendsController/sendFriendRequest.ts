import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no: reg_no, password: password });
        // check if you're not sending request you yourself
        if (!student) {
            res.status(200).json({
                status: false,
                message: "Wrong credentials"
            });
            return;
        }
        if (student.id === studentId) {
            res.status(200).json({
                status: false,
                message: "You can't send request to yourself"
            });
            return
        }

        // to check if the student (to whome send the friend req) is already present in his friend list or not 
        const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

        // to check if the student (to whome send the friend req) is already present in his Sent list or not 
        const isStudentInSentList = student.sentFriendRequests.some(std => std.equals(studentId));

        if (!isStudentInFriendList && !isStudentInSentList) {
            // searching the student to send request
            Student.findById(studentId)
                .then(toSendfrndReqStudent => {
                    if (toSendfrndReqStudent) {
                        // saving the student into student request list to whome friend req will be send
                        toSendfrndReqStudent.friendRequests.push(student.id)
                        toSendfrndReqStudent.save()
                            .then(() => {
                                // saving the student (to whome friend req will be send) into student sentrequest list
                                student.sentFriendRequests.push(toSendfrndReqStudent.id)
                                student.save()
                                    .then(() => {
                                        res.status(200).json({
                                            status: true,
                                            message: "Friend request sent successfully"
                                        });
                                    })
                                    .catch((e) => {
                                        res.status(500).json({
                                            status: false,
                                            message: "Error sending Friend request",
                                            errorMessage: e.message
                                        })
                                    })
                                return
                            })
                            .catch((e) => {
                                res.status(500).json({
                                    status: false,
                                    message: "Error sending Friend request",
                                    errorMessage: e.message
                                })
                            })
                    } else {
                        res.status(404).json({
                            status: false,
                            message: "Student not found"
                        });
                    }
                    return
                })
        }
        else if (isStudentInSentList) {
            res.status(200).json({
                status: false,
                message: "Friend request already sent"
            });
        }
        else {
            res.status(200).json({
                status: false,
                message: "Already friends"
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
            errorMessage: error.message
        })
    }
}