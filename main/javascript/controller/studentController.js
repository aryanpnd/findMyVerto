const UmsScrapper = require('../middlewares/scrapper');
const { Student } = require('../models/studentModels');

const getStudentInfo = async (req, res) => {
    try{
        const exists = await Student.findOne({ registrationNumber: req.body.regNo,password:req.body.password });
        if (exists) {
            res.status(200).send(exists)
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    }catch (e){
        res.status(500).send(e);
    }
}

const getStudentTimeTable = async (req, res) => {
    try{
        const exists = await Student.findOne({ registrationNumber: req.body.regNo,password:req.body.password });
        if (exists) {
            res.status(200).send(exists)
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    }catch (e){
        res.status(500).send(e);
    }
}


module.exports = { getStudentInfo,getStudentTimeTable }