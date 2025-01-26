import { Request, Response } from "express";
import { Student } from "../../models/studentModel";

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const { reg_no, password, studentId } = req.body;

        const student = await Student.findOne({ reg_no: reg_no, password: password })

        if (!student) {
            return res.status(404).json({
                status: false,
                message: "Invalid credentials"
            });
        }
        // to check if the student (to whome remove from the friend) is already present in his friend list or not 
        if (student && student.friends.some(std => std.equals(studentId))) {
            // searching the student to whome remove from the friend
            Student.findById(studentId)
                .then(toRemovefrndListStudent => {
                    if (toRemovefrndListStudent) {
                        // removing the student from the student friend list
                        toRemovefrndListStudent.friends = toRemovefrndListStudent.friends.filter(id => !id.equals(student.id));
                        toRemovefrndListStudent.save()
                            .then(() => {
                                // removing the student from student friend list
                                student.friends = student.friends.filter(id => !id.equals(toRemovefrndListStudent.id));
                                student.save()
                                    .then(() => {
                                        res.status(200).json({
                                            status: true,
                                            message: `${toRemovefrndListStudent.name} has been Removed from your friends list`
                                        })
                                    })
                                    .catch((e) => {
                                        res.status(500).json({
                                            status: false,
                                            message: "Error while removing the Friend list",
                                            errorMessage: e.message
                                        })
                                    })
                                return
                            })
                            .catch((e) => {
                                res.status(500).json({
                                    status: false,
                                    message: "Error while removing the Friend list",
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
        } else {
            res.send({ status: false, message: "Friend is Not in your friend list" })
        }

    } catch (e: any) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
            errorMessage: e.message,
        })
    }

}