import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const removeFromRequest = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no: reg_no, password: password });

        if (!student) {
            return res.status(404).send({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isStudentInFriendReqList = student.friendRequests.some(std => std.equals(studentId));

        if (isStudentInFriendReqList) {
            // searching the student to whome remove from the friend req list
            Student.findById(studentId)
                .then(toRemovefrndListStudent => {
                    if (toRemovefrndListStudent) {
                        // removing the student from the student friend req list
                        toRemovefrndListStudent.sentFriendRequests = toRemovefrndListStudent.sentFriendRequests.filter(id => !id.equals(student.id))
                        toRemovefrndListStudent.save()
                            .then(() => {
                                // removing the student from student friend req list
                                student.friendRequests = student.friendRequests.filter(id => !id.equals(toRemovefrndListStudent.id))
                                student.save()
                                    .then(() => {
                                        res.status(200).send({
                                            success: true,
                                            message: "Removed from the Friends request list"
                                        });
                                    })
                                    .catch((e) => {
                                        res.status(500).send({
                                            success: false,
                                            message: "Error while removing the Friend request list",
                                            errorMessage: e.message
                                        })
                                    })
                                return
                            })
                            .catch((e) => {
                                res.status(500).send({
                                    success: false,
                                    message: "Error while removing the Friend request list",
                                    errorMessage: e.message
                                })
                            })
                    } else {
                        res.status(404).send({ success: false, message: "Student not found" });
                    }
                    return
                })
                .catch((e) => {
                    res.status(500).send({
                        success: false,
                        message: "Error while removing the Friend request list",
                        errorMessage: e.message
                    })
                })
        } else {
            res.send({ 
                success: true, 
                message: "Not in friend request list"
             })
        }

    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            errorMessage: e.message
        })
    }

}