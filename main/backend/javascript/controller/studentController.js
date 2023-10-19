const UmsScrapper = require('../middlewares/scrapper');
const { Attendance } = require('../models/studentAttendanceModal');
const { Student } = require('../models/studentModels');
const { TimeTable } = require('../models/studentTimeTable');

// due to server load and low budget i'm using username and password coming from the req.body, else decrypting username and pass from the bearer token would be an efficient choice here. 

const getStudentInfo = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo, password: req.body.password });
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getStudentTimeTable = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo });
        if (user) {
            const time_table = await TimeTable.findOne({ registrationNumber: req.regNo, }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (time_table && !req.body.sync) {
                res.status(200).send(time_table)
            }
            else {
                const umsScrapper = new UmsScrapper(req.regNo.toString(), req.body.password);
                try {
                    await umsScrapper.init();
                    const loginSuccess = await umsScrapper.login();
                    if (loginSuccess) {
                        const userTimeTable = await umsScrapper.get_time_table();
                        if (userTimeTable.errorStatus) {
                            res.status(400).send(userTimeTable);
                            umsScrapper.close()
                            return
                        }
                        if (req.body.sync) {
                            await TimeTable.findOneAndUpdate({ registrationNumber: req.regNo }, { userTimeTable, lastSync: new Date() }, { new: true }).select({ _id: 0, registrationNumber: 0, __v: 0 }).then((result) => {
                                res.status(200).send(result)
                            })
                                .catch((error) => {
                                    res.status(400).send(error);
                                });
                        } else {
                            const time_table = new TimeTable(userTimeTable)
                            time_table.registrationNumber = req.regNo
                            time_table.lastSync = new Date()
                            await time_table.save()
                                .then(async (result) => {
                                    // requesting again so that we only get selected fields
                                    await TimeTable.findOne({ registrationNumber: req.regNo, }).select({ _id: 0, registrationNumber: 0, __v: 0 }).then((data)=>{
                                        res.status(200).send(data)
                                    }).catch((error)=>{
                                        res.status(400).send(error);
                                    })
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
                                });
                        }
                    }
                } catch (e) {
                    res.send(e)
                }
                umsScrapper.close()
            }
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getStudentAttendance = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo.toString() });
        if (user) {
            const user_attendance = await Attendance.findOne({ registrationNumber: req.regNo, }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (user_attendance && !req.body.sync) {
                res.status(200).send(user_attendance)
            }
            else {
                const umsScrapper = new UmsScrapper(req.regNo.toString(), req.body.password);
                try {
                    await umsScrapper.init();
                    const loginSuccess = await umsScrapper.login();
                    if (loginSuccess) {
                        const userAttendace = await umsScrapper.get_user_attendance();
                        if (userAttendace.errorStatus) {
                            res.status(400).send(userAttendace);
                            umsScrapper.close()
                            return
                        }
                        if (req.body.sync) {
                            await Attendance.findOneAndUpdate({ registrationNumber: req.regNo }, { attendanceHistory: userAttendace, lastSync: new Date() }, { new: true })
                                .then((result) => {
                                    res.status(200).send(result)
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
                                });
                        } else {
                            const attendance = new Attendance({ attendanceHistory: userAttendace })
                            attendance.registrationNumber = req.regNo
                            attendance.lastSync = new Date()

                            await attendance.save()
                                .then((result) => {
                                    res.status(200).send(result)
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
                                });
                        }
                    }
                } catch (e) {
                    res.send(e)
                }
                umsScrapper.close()
            }
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}


module.exports = { getStudentInfo, getStudentTimeTable, getStudentAttendance }