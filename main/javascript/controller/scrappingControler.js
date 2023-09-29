const UmsScrapper = require('../middlewares/scrapper');

const getStudentInfoScrapped = async (req, res) => {
    const regNo = req.query.regNo
    const pass = req.query.password;
    const umsScrapper = new UmsScrapper(regNo, pass, false);
    await umsScrapper.init();
    const loginSuccess = await umsScrapper.login();
    if (loginSuccess) {
        const userInfo = await umsScrapper.get_user_info();
        res.status(200).send(userInfo)
    }else{
        res.status(400).send(`Some error occurred while loggin into UMS`);
    }
    await umsScrapper.close();
}

module.exports = {getStudentInfoScrapped}