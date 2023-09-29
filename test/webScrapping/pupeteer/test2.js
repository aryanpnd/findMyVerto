const puppeteer = require('puppeteer');

class UmsScrapper {
    constructor(username, password, headless = true) {
        this.username = username;
        this.password = password;
        this.headless = headless;
        this.is_user_loggedIn = false;
    }

    async init() {
        this.browser = await puppeteer.launch({ headless: this.headless });
        this.page = await this.browser.newPage();
    }

    async login() {
        try {
            await this.page.goto('https://ums.lpu.in/lpuums/');
            await this.page.type('#txtU', this.username);
            await this.page.keyboard.press('Enter');
            await this.page.waitForNavigation();
            await this.page.type('#TxtpwdAutoId_8767', this.password);
            await Promise.all([
                this.page.waitForNavigation(),
                this.page.click('#iBtnLogins'),
            ]);
            const pName = await this.page.$x('/html/body/div[3]/div/div[2]');
            if (pName.length > 0) {
                console.log(`${await (await pName[0].getProperty('textContent')).jsonValue()} \nIncorrect username or password`);
                return false;
            } else {
                console.log("Login succeeded");
                this.is_user_loggedIn = true;
                return true;
            }
        } catch (error) {
            console.log(`Error occurred while fetching UMS: ${error}`);
        }
    }

    async get_user_info() {
        if (!this.is_user_loggedIn) {
            return "login first";
        }

        try {
            await this.page.goto('https://ums.lpu.in/lpuums/default3.aspx');

            const student_details = [];

            const student_name = await this.page.$eval('#ctl00_cphHeading_Logoutout1_lblId', el => el.textContent);
            student_details.push({ "name": student_name.split(' (')[0] });

            student_details.push({ "registration no.": this.username });

            const student_section = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[1]/p');
            const student_section_text = await this.page.evaluate(element => element.textContent, student_section[0]);
            student_details.push({ "section": student_section_text });

            // const student_program = await this.page.$eval('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[3]/p/a', el => el.textContent);
            // student_details.push({ "section": student_program});

            // const student_ums_pass_exp = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[3]/p/a');
            // student_details.push({ "section": student_ums_pass_exp});


            return student_details;
        } catch (error) {
            console.log(`Error occurred while fetching UMS: ${error}`);
        }
    }

    async close() {
        await this.browser.close();
    }
}

(async () => {
    const umsScrapper = new UmsScrapper('12204116', 'Khan@12345',false);
    await umsScrapper.init();
    const loginSuccess = await umsScrapper.login();
    if (loginSuccess) {
        const userInfo = await umsScrapper.get_user_info();
        console.log(userInfo);
    }
    // await umsScrapper.close();
})();
