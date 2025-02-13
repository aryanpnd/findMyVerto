const jwt = require('jsonwebtoken');
const { Student } = require('../models/studentModels');
const axios = require('axios');
require("dotenv").config()

const secretKey = process.env.SECRETKEY;
const scrapperBaseUrl = process.env.SCRAPPER_BASE_URL;

const studentLogin = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.body.regNo, password: req.body.password });
        if (user) {
            const token = jwt.sign({ userId: user.registrationNumber }, secretKey, { expiresIn: "30d" });
            res.status(200).json({ status: true, message: "Login success", token: token });
        } else {
            const userExists = await Student.findOne({ registrationNumber: req.body.regNo });
            const loginMsg = await axios.post(`${scrapperBaseUrl}/scrap/getStudentInfo`, {
                regNo: req.body.regNo,
                password: req.body.password
            });

            if (userExists) {
                if (loginMsg.status) {
                    await Student.findOneAndUpdate(
                        { registrationNumber: req.body.regNo },
                        { password: req.body.password }
                    );
                    const token = jwt.sign({ userId: req.body.regNo }, secretKey, { expiresIn: "30d" });
                    res.status(200).json({ status: true, message: "Login success", token: token });
                } else {
                    res.send(loginMsg.data);
                }
            } else {
                if (loginMsg.status) {
                    const student = new Student(loginMsg.data);
                    await student.save();
                    const token = jwt.sign({ userId: req.body.regNo }, secretKey, { expiresIn: "30d" });
                    res.status(200).json({ status: true, message: "Login success", token: token });
                } else {
                    res.send(loginMsg.data);
                }
            }
        }
    } catch (e) {
        res.status(500).send(`error occurred ${e}`);
    }
};

const studentSignup = async (req, res) => {
    try {
        const loginMsg = await axios.post(`${scrapperBaseUrl}/scrap/getStudentInfo`, {
            regNo: req.body.regNo,
            password: req.body.password
        });

        if (loginMsg.status) {
            const student = new Student(loginMsg.data);
            await student.save();
            res.status(200).send(`Account created successfully`);
        } else {
            res.send(loginMsg.data);
        }
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            res.status(409).send(`Account already exists, please login`);
        } else {
            res.status(400).send(`Some error occurred ${err}`);
        }
    }
};

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ status: false, message: 'Authentication failed, please login' });
    }

    jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Authentication failed. Invalid token.' });
        }
        req.regNo = decoded.userId;
        next();
    });
};

module.exports = { studentLogin, studentSignup, authenticate }