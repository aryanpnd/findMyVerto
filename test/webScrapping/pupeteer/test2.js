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

            const student_rollNo = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[1]/p');
            const student_rollNo_text = await this.page.evaluate(element => element.textContent, student_rollNo[0]);
            student_details.push({ "rollNo.": student_rollNo_text });

            const student_section = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[2]/p');
            const student_section_text = await this.page.evaluate(element => element.textContent, student_section[0]);
            student_details.push({ "section and group.": student_section_text });

            const student_program = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[3]/p/a');
            const student_program_text = await this.page.evaluate(element => element.textContent, student_program[0]);
            student_details.push({ "program": student_program_text });


            return student_details;
        } catch (error) {
            console.log(`Error occurred while fetching UMS: ${error}`);
        }
    }

    async get_time_table() {
        if (!this.is_user_loggedIn) {
            return "login first";
        }

        try {
            await this.page.goto('https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx');
            await this.page.waitForXPath('/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table');
            const timeTable = await this.tableParser();
            return timeTable;
        } catch (error) {
            console.log(`Error occurred while fetching UMS: ${error}`);
        }
    }

    async tableParser() {
        const time_table = [
            { "Monday": {} },
            { "Tuesday": {} },
            { "Wednesday": {} },
            { "Thursday": {} },
            { "Friday": {} },
            { "Saturday": {} },
            { "Sunday": {} }
        ];

        const rows = await this.page.$x('/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table//tr[position()>2]');

        try{
        for (let i = 0; i <= rows.length; i++) {
            const columns = await rows[i].$$('td:nth-child(n+2)');
            for (let j = 0; j < time_table.length; j++) {
                const day_name = Object.keys(time_table[j])[0];
                const time_slot = await (await columns[0].getProperty('textContent')).jsonValue();
                const value = await (await columns[j + 1].getProperty('textContent')).jsonValue();

                time_table[j][day_name][time_slot] = value;
            }
        }}
         catch (error) {
             return(time_table);
        }
        return time_table;
    }

    async close() {
        await this.browser.close();
    }
}

(async () => {
    const umsScrapper = new UmsScrapper('12220778', 'Rocky@212020', false);
    await umsScrapper.init();
    const loginSuccess = await umsScrapper.login();
    // if (loginSuccess) {
    //     const userInfo = await umsScrapper.get_user_info();
    //     console.log(userInfo);
    // }
    if (loginSuccess) {
        const userTimeTable = await umsScrapper.get_time_table();
        console.log(userTimeTable);
    }
    // await umsScrapper.close();
})();
