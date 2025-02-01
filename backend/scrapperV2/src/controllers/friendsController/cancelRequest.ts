import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const cancelRequest = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no: reg_no, password: password });

        if (!student) {
            return res.status(404).send({ success: false, message: "Invalid credentials" });
        }

        const isStudentInSentReqList = student.sentFriendRequests.some(std => std.equals(studentId));

        if (isStudentInSentReqList) {
            // searching the student to whome cancel from the sent req list
            Student.findById(studentId)
                .then(toCancelSentReqListStudent => {
                    if (toCancelSentReqListStudent) {
                        // cancelling the student from the student's friend req list
                        toCancelSentReqListStudent.friendRequests = toCancelSentReqListStudent.friendRequests.filter(id => !id.equals(student.id))
                        toCancelSentReqListStudent.save()
                            .then(() => {
                                // removing the student from sent req list
                                student.sentFriendRequests = student.sentFriendRequests.filter(id => !id.equals(toCancelSentReqListStudent.id))
                                student.save()
                                    .then(() => {
                                        res.send({ success: true, message: `${toCancelSentReqListStudent.name} has been Removed from your sent request list` })
                                    })
                                    .catch((e) => res.send({ success: false, message: "Error while Removing from the sent request list" }))
                                return
                            })
                            .catch((e) => res.send({ success: false, message: "Error while removing the sent request list" }))
                    } else {
                        res.send({ success: false, message: "Student not found" })
                    }
                    return
                })
                .catch((e) => res.send({ success: false, message: "Not in your sent request list" }))
        } else {
            res.send({ success: false, message: "Not in your sent request list" })
        }

    } catch (e: any) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            errorMessage: e.message,
        })
    }
}