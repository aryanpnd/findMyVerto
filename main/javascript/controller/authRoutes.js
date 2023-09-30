const UmsScrapper = require('../middlewares/scrapper');
const { Student } = require('../models/studentModels');

const studentLogin = async (req, res) => {
    try{
        const exists = await Student.exists({ registrationNumber: req.body.regNo,password:req.body.password });
        if (exists) {
            res.status(200).send("Login success")
        } else {
            res.status(500).send(`Wrong username or password`);
        }
    }catch (e){
        res.status(500).send(e);
    }
}

const studentSignup = async (req, res) => {
    const regNo = req.body.regNo
    const pass = req.body.password;
    const umsScrapper = new UmsScrapper(regNo, pass, false);
    await umsScrapper.init();
    const loginMsg = await umsScrapper.login();
    const studentDetails = await umsScrapper.get_user_info();
    if (loginMsg.status) {
        const student = new Student(studentDetails);
        await student
            .save()
            .then((docs) => {
                res.status(200).send(`Account created successfully`);
            })
            .catch((err) => {
                if(err.name === 'MongoServerError' && err.code === 11000){
                    res.status(409).send(`Account already exists, please login`);
                }else{
                    res.status(400).send(`Some error occured ${err}`);
                }
            });
    }else{
        res.send(loginMsg)
    }
    umsScrapper.close()
}

module.exports = { studentLogin, studentSignup }