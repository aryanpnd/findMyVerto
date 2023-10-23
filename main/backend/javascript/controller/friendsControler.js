const { Attendance } = require("../models/studentAttendanceModal");
const { Student } = require("../models/studentModels");
const { TimeTable } = require("../models/studentTimeTable");

const getFriendList = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo })
            .populate("friends", { password: 0, friendRequests: 0, sentFriendRequests: 0, friends: 0 })
            .select({ _id: 0, frinds: 1 })
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getFriendData = async (req, res) => {
    try {
        const studentId = req.body.studentId;
        await Student.findOne({ registrationNumber: req.regNo })
            .then(async student => {
                const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

                if (isStudentInFriendList) {
                    await Student.findById(studentId)
                    .select({ password: 0, friendRequests: 0, sentFriendRequests: 0, friends: 0 })
                    .then(async result => {
                        const timetable = await TimeTable.findOne({ registrationNumber: result.registrationNumber })
                        const attendance = await Attendance.findOne({ registrationNumber: result.registrationNumber })
                        res.send({ succes: true, studentInfo: result, timetable: timetable, attendance: attendance });
                    })
                } else {
                    res.send({ succes: false, msg: "Not friends" })
                }
            })

    } catch (e) {
        res.status(500).send(e);
    }
}

const getFriendRequests = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo })
            .populate("friendRequests", { imageURL: 1, name: 1, registrationNumber: 1, section: 1 })
            .select({ _id: 0, friendRequests: 1 })
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getSentFriendRequests = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo })
            .populate("sentFriendRequests", { imageURL: 1, name: 1, registrationNumber: 1, section: 1 })
            .select({ _id: 0, sentFriendRequests: 1 })
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const sendFriendRequest = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            // check if you're not sending request you yourself
            if (student.id === studentId) {
                res.send({ status: false, msg: "Cannot send to yourself" })
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
                        // saving the student into student request list to whome friend req will be send
                        toSendfrndReqStudent.friendRequests.push(student.id)
                        toSendfrndReqStudent.save()
                            .then(() => {
                                // saving the student (to whome friend req will be send) into student sentrequest list
                                student.sentFriendRequests.push(toSendfrndReqStudent.id)
                                student.save()
                                    .then(() => {
                                        res.send({ succes: true, msg: "Friend Request sent" })
                                    })
                                    .catch((e) => res.send({ succes: false, msg: "Error sending Friend request" }))
                                return
                            })
                            .catch((e) => res.send({ succes: false, msg: "Error sending Friend request",error:e }))
                        return
                    })
            }
            else if (isStudentInSentList) {
                res.send({ success: false, msg: "Already sent" })
            }
            else {
                res.send({ succes: true, msg: 'Already friends' });
            }
        })
        .catch(error => {
            res.send({ "error": error });
        });
}

const addFriend = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            // to check if the student (to whome accept the friend req) is already present in his friend list or not 
            const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

            // to check if the student (to whome accept the friend req) is already present in his request list or not 
            const isStudentInRequestList = student.friendRequests.some(std => std.equals(studentId));

            if (!isStudentInFriendList && isStudentInRequestList) {
                // searching the student to whome add to friend
                Student.findById(studentId)
                    .then(toAcceptfrndReqStudent => {
                        // saving the student into student friend list and removing us from his sentRequestList list
                        toAcceptfrndReqStudent.friends.push(student.id)
                        toAcceptfrndReqStudent.sentFriendRequests.pop(student.id)
                        toAcceptfrndReqStudent.friendRequests.pop(student.id)
                        toAcceptfrndReqStudent.save()
                            .then(() => {
                                // saving the student (to whome add to friend) into student friend list
                                student.friends.push(toAcceptfrndReqStudent.id)
                                student.friendRequests.pop(toAcceptfrndReqStudent.id)
                                student.sentFriendRequests.pop(toAcceptfrndReqStudent.id)
                                student.save()
                                    .then(() => {
                                        res.send({ success: true, msg: "Added to friend" })
                                    })
                                    .catch((e) => res.send({ success: false, msg: "Error while Adding to the Friend" }))
                                return
                            })
                            .catch((e) => res.send({ success: false, msg: "Error while accepting Friend request" }))
                        return
                    })
            }
            else if (isStudentInFriendList) {
                res.send({ succes: true, msg: 'Already friends' });
            }
            else {
                res.send({ success: false, msg: "Friend is not in request list" })
            }
        })
        .catch(error => {
            res.send({ "error": error });
        });
}

const removeFromRequest = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            const isStudentInFriendReqList = student.friendRequests.some(std => std.equals(studentId));

            if (isStudentInFriendReqList) {
                // searching the student to whome remove from the friend req list
                Student.findById(studentId)
                    .then(toRemovefrndListStudent => {
                        // removing the student from the student friend req list
                        toRemovefrndListStudent.sentFriendRequests.pop(student.id)
                        toRemovefrndListStudent.save()
                            .then(() => {
                                // removing the student from student friend req list
                                student.friendRequests.pop(toRemovefrndListStudent.id)
                                student.save()
                                    .then(() => {
                                        res.send({ success: true, msg: `${toRemovefrndListStudent.name} has been Removed from your friends request list` })
                                    })
                                    .catch((e) => res.send({ success: false, msg: "Error while Removing from the Friends request list" }))
                                return
                            })
                            .catch((e) => res.send({ success: false, msg: "Error while removing the Friend request list" }))
                        return
                    })
                    .catch((e) => res.send({ success: false, msg: "Not in your request list" }))
            } else {
                res.send({ success: false, msg: "Not in your request list" })
            }
        })
        .catch(error => {
            res.send({ "error": error });
        });
}

const cancelRequest = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            const isStudentInSentReqList = student.sentFriendRequests.some(std => std.equals(studentId));

            if (isStudentInSentReqList) {
                // searching the student to whome cancel from the sent req list
                Student.findById(studentId)
                    .then(toCancelSentReqListStudent => {
                        // cancelling the student from the student's friend req list
                        toCancelSentReqListStudent.friendRequests.pop(student.id)
                        toCancelSentReqListStudent.save()
                            .then(() => {
                                // removing the student from sent req list
                                student.sentFriendRequests.pop(toCancelSentReqListStudent.id)
                                student.save()
                                    .then(() => {
                                        res.send({ success: true, msg: `${toCancelSentReqListStudent.name} has been Removed from your sent request list` })
                                    })
                                    .catch((e) => res.send({ success: false, msg: "Error while Removing from the sent request list" }))
                                return
                            })
                            .catch((e) => res.send({ success: false, msg: "Error while removing the sent request list" }))
                        return
                    })
                    .catch((e) => res.send({ success: false, msg: "Not in your sent request list" }))
            } else {
                res.send({ success: false, msg: "Not in your sent request list" })
            }
        })
        .catch(error => {
            res.send({ "error": error });
        });
}

const removeFriend = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            // to check if the student (to whome remove from the friend) is already present in his friend list or not 
            const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

            if (isStudentInFriendList) {
                // searching the student to whome remove from the friend
                Student.findById(studentId)
                    .then(toRemovefrndListStudent => {
                        // removing the student from the student friend list
                        toRemovefrndListStudent.friends.pop(student.id)
                        toRemovefrndListStudent.save()
                            .then(() => {
                                // removing the student from student friend list
                                student.friends.pop(toRemovefrndListStudent.id)
                                student.save()
                                    .then(() => {
                                        res.send({ success: true, msg: `${toRemovefrndListStudent.name} has been Removed from your friends list` })
                                    })
                                    .catch((e) => res.send({ success: false, msg: "Error while Removing from the Friends list" }))
                                return
                            })
                            .catch((e) => res.send({ success: false, msg: "Error while removing the Friend list" }))
                        return
                    })
            }
            else {
                res.send({ success: false, msg: "Friend is Not in your friend list" })
            }
        })
        .catch(error => {
            res.send({ "error": error });
        });
}

module.exports = { getFriendData, getFriendList, getFriendRequests, getSentFriendRequests, sendFriendRequest, addFriend, removeFriend, removeFromRequest, cancelRequest }