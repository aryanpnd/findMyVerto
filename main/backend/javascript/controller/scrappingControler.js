const UmsScrapper = require('../middlewares/scrapper');
const { Student } = require('../models/studentModels');
const { TimeTable } = require('../models/studentTimeTable');

const getStudentInfoScrapped = async (req, res) => {
    try {
        const exists = await Student.findOne({ registrationNumber: req.body.regNo, password: req.body.password });
        if (exists) {
            const umsScrapper = new UmsScrapper(req.query.regNo, req.query.password);
            await umsScrapper.init();
            const loginSuccess = await umsScrapper.login();
            if (loginSuccess) {
                const userInfo = await umsScrapper.get_user_info();
                if(userInfo.errorStatus){
                    res.status(400).send(userInfo.message);
                    return
                }
                if(!req.body.update){
                    res.status(200).send(userInfo)
                }else{
                    await Student.findOneAndUpdate({registrationNumber:req.body.regNo},userInfo)
                    .then((result) => {
                        res.status(200).send(result)
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
                }
            } else {
                res.status(400).send(`Some error occurred while loggin into UMS`);
            }
            await umsScrapper.close();
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getStudentTimeTableScrapped = async (req, res) => {
    const umsScrapper = new UmsScrapper(req.body.regNo, req.body.password);
    try {
        const exists = await Student.findOne({ registrationNumber: req.body.regNo, password: req.body.password });
        if (exists) {
            await umsScrapper.init();
            const loginSuccess = await umsScrapper.login();
            console.log(loginSuccess);
            if (loginSuccess) {
                const userTimeTable = await umsScrapper.get_time_table();
                if(userTimeTable.errorStatus){
                    res.status(400).send(userTimeTable.message);
                    return
                }

                if(!req.body.update){
                    const timeTable = new TimeTable(userTimeTable)
                    timeTable.RegistrationNumber = req.body.regNo
                    await timeTable.save()
                    .then((result) => {
                        res.status(200).send(result)
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
                }else{
                    await TimeTable.findOneAndUpdate({RegistrationNumber:req.body.regNo},userTimeTable)
                    .then((result) => {
                        res.status(200).send(result)
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
                }
            } else {
                res.status(400).send(`Some error occurred while loggin into UMS`);
            }
            await umsScrapper.close();
            
        } else {
            res.status(500).send(`User doesn't exists in database, Signup first`);
            await umsScrapper.close();
        }
    } catch (e) {
        res.status(500).send(e);
        await umsScrapper.close();
    }
}

module.exports = { getStudentInfoScrapped, getStudentTimeTableScrapped }