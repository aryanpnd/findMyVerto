const UmsScrapper = require("../scrapper");

const getStudentInfo = async (req, res) => {
    const { regNo, password } = req.body;
    const umsScrapper = new UmsScrapper(regNo, password);
    await umsScrapper.init();
    const loginMsg = await umsScrapper.login();
    if (loginMsg.status) {
        const studentDetails = await umsScrapper.get_user_info();
        res.status(200).json(studentDetails);
    } else {
        res.status(400).json(loginMsg);
    }
    umsScrapper.close();
}

const getStudentTimeTable = async (req, res) => {
    const { regNo, password } = req.body;
    const umsScrapper = new UmsScrapper(regNo, password);
    await umsScrapper.init();
    const loginMsg = await umsScrapper.login();
    if (loginMsg.status) {
        const timeTable = await umsScrapper.get_time_table();
        res.status(200).json(timeTable);
    } else {
        res.status(400).json(loginMsg);
    }
    umsScrapper.close();
}

const getStudentAttendance = async (req, res) => {
    const { regNo, password } = req.body;
    const umsScrapper = new UmsScrapper(regNo, password);
    await umsScrapper.init();
    const loginMsg = await umsScrapper.login();
    if (loginMsg.status) {
        const attendance = await umsScrapper.get_user_attendance();
        res.status(200).json(attendance);
    } else {
        res.status(400).json(loginMsg);
    }
    umsScrapper.close();
}

module.exports = { getStudentInfo, getStudentTimeTable, getStudentAttendance };