const UmsScrapper = require('../middlewares/scrapper');
const jwt = require('jsonwebtoken');
const { Student } = require('../models/studentModels');
require("dotenv").config()

const secretKey = process.env.SECRETKEY;

const studentLogin = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.body.regNo, password: req.body.password });
        if (user) {
            const token = jwt.sign({ userId: user.registrationNumber }, secretKey, { expiresIn: "30d" });
            res.status(200).json({ status: true, message: "Login success", token: token })
        } else {
            // here , i have to make password change logic where i will check if the user exists with this registration number in database , if yes then i will scrape and update the password in db else i will scrape and save a new user
            const umsScrapper = new UmsScrapper(req.body.regNo, req.body.password);
            await umsScrapper.init();
            const userExists = await Student.findOne({ registrationNumber: req.body.regNo });

            if (userExists) {
                const loginMsg = await umsScrapper.login();
                // updating UMS Password if the UMS password is correct
                if (loginMsg.status) {
                    await Student.findOneAndUpdate(
                        { registrationNumber: req.body.regNo },
                        { password: req.body.password },
                      )                      
                        .then(() => {
                            const token = jwt.sign({ userId: req.body.regNo }, secretKey, { expiresIn: "30d" });
                            res.status(200).json({ status: true, message: "Login success", token: token });
                        }).catch((error) => {
                            res.status(400).send(error);
                        });
                } else {
                    res.send(loginMsg)
                }
            } else {
                const loginMsg = await umsScrapper.login();
                const studentDetails = await umsScrapper.get_user_info();
                if (loginMsg.status) {
                    const student = new Student(studentDetails);
                    await student
                        .save()
                        .then((docs) => {
                            const token = jwt.sign({ userId: req.body.regNo }, secretKey, { expiresIn: "30d" });
                            res.status(200).json({ status: true, message: "Login success", token: token });
                        })
                        .catch((err) => {
                            res.status(400).send(`Some error occured ${err}`);
                        });
                } else {
                    res.send(loginMsg)
                }
            }
            umsScrapper.close()
        }
    } catch (e) {
        res.status(500).send(`error occured ${e}`);
    }
}

const studentSignup = async (req, res) => {
    const umsScrapper = new UmsScrapper(req.body.regNo, req.body.password);
    await umsScrapper.init();
    const loginMsg = await umsScrapper.login();
    const studentDetails = await umsScrapper.get_user_info();
    if (loginMsg.status) {
        const student = new Student(studentDetails);
        await student
            .save()
            .then(() => {
                res.status(200).send(`Account created successfully`);
            })
            .catch((err) => {
                if (err.name === 'MongoServerError' && err.code === 11000) {
                    res.status(409).send(`Account already exists, please login`);
                } else {
                    res.status(400).send(`Some error occured ${err}`);
                }
            });
    } else {
        res.send(loginMsg)
    }
    umsScrapper.close()
}

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
        // res.send({regno:decoded.userId})
        next();
    });
}

module.exports = { studentLogin, studentSignup, authenticate }