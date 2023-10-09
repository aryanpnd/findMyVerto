const UmsScrapper = require('../middlewares/scrapper');
const { Attendance } = require('../models/studentAttendanceModal');
const { Student } = require('../models/studentModels');
const { TimeTable } = require('../models/studentTimeTable');

// due to server load and low budget i'm using username and password coming from the req.body, else decrypting username and pass from the bearer token would be an efficient choice here. 

const getStudentInfo = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.body.regNo, password: req.body.password });
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
        const user = await Student.findOne({ registrationNumber: req.body.regNo });
        if (user) {
            const time_table = await TimeTable.findOne({ registrationNumber: req.body.regNo, }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (time_table) {
                res.status(200).send(time_table)
            }
            else {
                const umsScrapper = new UmsScrapper(req.body.regNo, req.body.password,);
                try {
                    await umsScrapper.init();
                    const loginSuccess = await umsScrapper.login();
                    if (loginSuccess) {
                        const userTimeTable = await umsScrapper.get_time_table();
                        if (userTimeTable.errorStatus) {
                            res.status(400).send(userTimeTable.message);
                            umsScrapper.close()
                            return
                        }
                        const timeTable = new TimeTable(userTimeTable)
                        timeTable.registrationNumber = req.body.regNo

                        await timeTable.save()
                            .then((result) => {
                                res.status(200).send(result)
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            });
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
        const user = await Student.findOne({ registrationNumber: req.body.regNo });
        if (user) {
            const attendance = await Attendance.findOne({ registrationNumber: req.body.regNo, }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (attendance) {
                res.status(200).send(attendance)
            }
            else {
                const umsScrapper = new UmsScrapper(req.body.regNo, req.body.password);
                try {
                    await umsScrapper.init();
                    const loginSuccess = await umsScrapper.login();
                    if (loginSuccess) {
                        const userAttendance = await umsScrapper.get_user_attendance();
                        if (userAttendance.errorStatus) {
                            res.status(400).send(userAttendance.message);
                            umsScrapper.close()
                            return
                        }
                        const attendance = new Attendance({attendanceHistory:userAttendance})
                        attendance.registrationNumber = req.body.regNo

                        await attendance.save()
                            .then((result) => {
                                res.status(200).send(result)
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            });
                        umsScrapper.close()
                    }
                } catch (e) {
                    umsScrapper.close()
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