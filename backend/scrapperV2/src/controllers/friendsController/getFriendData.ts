import { Request, Response } from "express";
import { Student } from "../../models/studentModel";
import { TimeTable } from "../../models/studentTimetableModel";

const excludingFields = { password: 0, friendRequests: 0, sentFriendRequests: 0, friends: 0 };

export const getFriendData = async (req: Request, res: Response) => {
    try {
        const { reg_no, password } = req.body;
        const studentId = req.body.studentId;
        const student = await Student.findOne({ reg_no: reg_no, password: password });

        if (!student) {
            return res.status(404).json({
                succes: false,
                data: {},
                message: "Student not found"
            });
        }

        const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

        if (isStudentInFriendList) {
            await Student.findById(studentId)
                .select({
                    ...excludingFields,
                })
                .then(async result => {
                    if (result) {
                        const timetable = await TimeTable.findOne({ reg_no: result.reg_no });
                        res.status(200).json({
                            succes: true,
                            data: {
                                studentInfo: result,
                                timetable: timetable
                            },
                            message: "Friend fetched successfully",
                        });
                    } else {
                        res.status(404).json({
                            succes: false,
                            data: {},
                            message: "Friend not found",
                        });
                    }
                })
        } else {
            res.json({
                succes: false,
                data: {},
                message: "Not friends"
            })
        }

    } catch (e:any) {
        res.status(500).json({
            succes: false,
            data: {},
            message: "Internal server error",
            errorMessage: e.message
        });
    }
}