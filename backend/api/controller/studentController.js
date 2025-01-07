const { Attendance } = require('../models/studentAttendanceModal');
const { Student } = require('../models/studentModels');
const { TimeTable } = require('../models/studentTimeTable');
const axios = require('axios');
require("dotenv").config()

const scrapperBaseUrl = process.env.SCRAPPER_BASE_URL;
// due to server load and low budget i'm using username and password coming from the req.body, else decrypting username and pass from the bearer token would be an efficient choice here. 
const getStudentInfo = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo });
        if (user) {
            if (req.body.sync) {
                const loginMsg = await axios.post(`${scrapperBaseUrl}/scrap/getStudentInfo`, {
                    regNo: req.regNo,
                    password: req.body.password
                });

                if (loginMsg.status) {
                    await Student.findOneAndUpdate(
                        { registrationNumber: req.regNo },
                        { ...loginMsg.data, lastSync: new Date() },
                        { new: true }
                    ).then((result) => {
                        res.status(200).send({ status: true, message: "Data synced", data: result });
                    }).catch((error) => {
                        res.status(400).send({ status: false, message: "Error occurred", data: error });
                    });
                } else {
                    res.status(400).send({ status: false, message: "Login failed", data: "" });
                }
            } else {
                res.status(200).json({ status: true, message: "Info fetched", data: user });
            }
        } else {
            res.status(200).json({ status: false, message: "Student not found", data: "" });
        }
    } catch (e) {
        res.status(500).send(e);
    }
};


const searchStudents = async (req, res) => {
    const searchQuery = req.body.query;
    const searchLogic = {
        $and: [
            {
                $or: [
                    { name: { $regex: new RegExp(searchQuery, "i") } },
                    { registrationNumber: { $regex: new RegExp(searchQuery, "i") } },
                    { section: { $regex: new RegExp(searchQuery, "i") } },
                ],
            },
        ],
    };

    try {
        Student.find(searchLogic).select({ section: 1, name: 1, registrationNumber: 1, photoURL: 1, _id: 1 })
            .then((documents) => {
                res.status(200).json(documents);
            }).catch((err) => res.send(err));
    } catch (err) {
        res.status(400).send(`Some error occurred: ${err}`);
    }
};

const getStudentTimeTable = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo });
        if (user) {
            const time_table = await TimeTable.findOne({ registrationNumber: req.regNo }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (time_table && !req.body.sync) {
                res.status(200).send(time_table);
            } else {
                const loginMsg = await axios.post(`${scrapperBaseUrl}/scrap/getStudentTimeTable`, {
                    regNo: req.regNo,
                    password: req.body.password
                });

                if (loginMsg.data.errorStatus) {
                    res.status(400).send(loginMsg.data);
                    return;
                }

                if (req.body.sync) {
                    await TimeTable.findOneAndUpdate(
                        { registrationNumber: req.regNo },
                        { ...loginMsg.data, lastSync: new Date() },
                        { new: true }
                    ).select({ _id: 0, registrationNumber: 0, __v: 0 }).then((result) => {
                        res.status(200).send(result);
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                } else {
                    const time_table = new TimeTable(loginMsg.data);
                    time_table.registrationNumber = req.regNo;
                    time_table.lastSync = new Date();
                    await time_table.save().then(async (result) => {
                        await TimeTable.findOne({ registrationNumber: req.regNo }).select({ _id: 0, registrationNumber: 0, __v: 0 }).then((data) => {
                            res.status(200).send(data);
                        }).catch((error) => {
                            res.status(400).send(error);
                        });
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                }
            }
        } else {
            res.status(500).send(`User doesn't exist in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo });
        if (user) {
            const user_attendance = await Attendance.findOne({ registrationNumber: req.regNo }).select({ _id: 0, registrationNumber: 0, __v: 0 });
            if (user_attendance && !req.body.sync) {
                res.status(200).send(user_attendance);
            } else {
                const loginMsg = await axios.post(`${scrapperBaseUrl}/scrap/getStudentAttendance`, {
                    regNo: req.regNo,
                    password: req.body.password
                });

                if (loginMsg.data.errorStatus) {
                    res.status(400).send(loginMsg.data);
                    return;
                }

                if (req.body.sync) {
                    await Attendance.findOneAndUpdate(
                        { registrationNumber: req.regNo },
                        { attendanceHistory: loginMsg.data, lastSync: new Date() },
                        { new: true }
                    ).then((result) => {
                        res.status(200).send(result);
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                } else {
                    const attendance = new Attendance({ attendanceHistory: loginMsg.data });
                    attendance.registrationNumber = req.regNo;
                    attendance.lastSync = new Date();
                    await attendance.save().then((result) => {
                        res.status(200).send(result);
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                }
            }
        } else {
            res.status(500).send(`User doesn't exist in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
};


module.exports = { getStudentInfo, getStudentTimeTable, getStudentAttendance, searchStudents }
