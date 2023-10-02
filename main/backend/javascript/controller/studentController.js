const UmsScrapper = require('../middlewares/scrapper');
const { Student } = require('../models/studentModels');
const { TimeTable } = require('../models/studentTimeTable');

const getStudentInfo = async (req, res) => {
    try{
        const user = await Student.findOne({ registrationNumber: req.body.regNo,password:req.body.password });
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    }catch (e){
        res.status(500).send(e);
    }
}

const getStudentTimeTable = async (req, res) => {
    try{
        const time_table = await TimeTable.findOne({ RegistrationNumber: req.body.regNo, }).select({ _id: 0,RegistrationNumber:0,__v:0 });;
        if (time_table) {
            res.status(200).send(time_table)
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    }catch (e){
        res.status(500).send(e);
    }
}


module.exports = { getStudentInfo,getStudentTimeTable }