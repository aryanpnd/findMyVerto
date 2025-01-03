const puppeteer = require('puppeteer');
require("dotenv").config()

class UmsScrapper {
    constructor(username, password, headless = true) {
        this.username = username;
        this.password = password;
        this.headless = headless;
        this.is_user_loggedIn = false;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: this.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', //
                '--disable-accelerated-2d-canvas', //
                '--no-first-run', //
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
            executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH :
                puppeteer.executablePath()
        });
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
                this.page.click('[id^=iBtnLogins]'),
            ]);
            const pName = await this.page.$x('/html/body/div[3]/div/div[2]');
            if (pName.length > 0) {
                // console.log(`${await (await pName[0].getProperty('textContent')).jsonValue()} \nIncorrect username or password`);
                return { "status": false, "message": `${await (await pName[0].getProperty('textContent')).jsonValue()}` };
            } else {
                // console.log("Login succeeded");
                this.is_user_loggedIn = true;
                return { "status": true, "message": "Login successfully" };
            }
        } catch (error) {
            return ({ "status": false, "message": `Error occurred while fetching UMS: ${error}` });
        }
    }

    async bypasModal() {
        try {
            // Wait for the modal to appear, but not more than 5 seconds
            await this.page.waitForXPath('/html/body/div[8]/div[2]/div/div/div[3]/input[1]', { visible: true, timeout: 5000 });
            await this.page.click('#chkReadMessage');
            await this.page.waitForSelector('#btnClose:not([disabled])', { visible: true });
            await this.page.click('#btnClose');
            return
        } catch (error) {
            return
        }
    }

    async get_user_info() {
        if (!this.is_user_loggedIn) {
            return { status: false, message: "login first" };
        }


        try {
            const student_details = {};


            await this.page.goto('https://ums.lpu.in/lpuums/default3.aspx');

            const student_name = await this.page.$eval('#ctl00_cphHeading_Logoutout1_lblId', el => el.textContent);
            student_details["name"] = student_name.split(' (')[0];

            student_details["registrationNumber"] = this.username;
            student_details["password"] = this.password;

            const student_rollNo = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[1]/p');
            const student_rollNo_text = await this.page.evaluate(element => element.textContent, student_rollNo[0]);
            student_details["rollNo"] = student_rollNo_text.split("-")[1].split("(")[0].trim();

            const student_term = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[1]/p');
            const student_term_text = await this.page.evaluate(element => element.textContent, student_term[0]);
            student_details["term"] = student_term_text.split("(")[1].split(")")[0].split(":")[1];

            const student_section = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[2]/p');
            const student_section_text = await this.page.evaluate(element => element.textContent, student_section[0]);
            student_details["section"] = student_section_text.split("(")[1].split(")")[0].split(":")[1];

            const student_group = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[2]/p');
            const student_group_text = await this.page.evaluate(element => element.textContent, student_group[0]);
            student_details["group"] = student_group_text.split("-")[1].split("(")[0].trim();

            const student_program = await this.page.$x('//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[3]/p/a');
            const student_program_text = await this.page.evaluate(element => element.textContent, student_program[0]);
            student_details["program"] = student_program_text.split("Programme -")[1].split("View Programme Outcome")[0].trim();


            return student_details;
        } catch (error) {
            return { errorStatus: false, message: (`Error occurred while fetching UMS: ${error}`) };
        }
    }

    async get_time_table() {
        if (!this.is_user_loggedIn) {
            return { errorStatus: true, message: "login first" };
        }

        this.bypasModal()

        try {
            await this.page.goto('https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx');
            await this.page.waitForXPath('/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table');
            const timeTable = await this.tableParser();
            return timeTable;
        } catch (error) {
            return { errorStatus: true, message: (`Error occurred while fetching UMS: ${error}`) };
        }
    }

    async tableParser() {
        const time_table = {
            "Monday": {},
            "Tuesday": {},
            "Wednesday": {},
            "Thursday": {},
            "Friday": {},
            "Saturday": {},
            "Sunday": {}
        };

        const rows = await this.page.$x('/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table//tr[position()>2]');

        try {
            for (let i = 0; i < rows.length; i++) {
                const columns = await rows[i].$$('td:nth-child(n+2)');
                const time_slot = await (await columns[0].getProperty('textContent')).jsonValue();

                for (let j = 0; j < Object.keys(time_table).length; j++) {
                    const day_name = Object.keys(time_table)[j];
                    const value = await (await columns[j + 1].getProperty('textContent')).jsonValue();
                    time_table[day_name][time_slot] = value;
                }
            }
        } catch (error) {
            return time_table;
        }
        return time_table;
    }

    async get_user_attendance() {
        if (!this.is_user_loggedIn) {
            return { errorStatus: true, message: "login first" };
        }

        // this.bypasModal()

        try {
            await this.page.goto('https://ums.lpu.in/lpuums/StudentDashboard.aspx');
            await this.page.click('#AttPercent');
            await this.page.waitForResponse(response =>
                response.url().includes('StudentAttendanceDetail') && response.status() === 200
            );
            const data = await this.page.evaluate(() => {
                const table = document.getElementById('AttSummary');
                const rows = table.querySelectorAll('tr');
                const dataArray = [];

                for (let i = 0; i < rows.length; i += 2) { // Skip every other row
                    const columns = rows[i].querySelectorAll('td');
                    if (columns.length === 6) { // Ensure it's a data row with 6 columns
                        const obj = {
                            course: columns[0].textContent.trim(),
                            lastAttended: columns[1].textContent.trim(),
                            dutyLeave: columns[2].textContent.trim(),
                            totalDelivered: columns[3].textContent.trim(),
                            totalAttended: columns[4].textContent.trim(),
                            totalPercentage: columns[5].textContent.trim(),
                        };
                        dataArray.push(obj);
                    }
                }

                return dataArray;
            });

            return data

        } catch (error) {
            return { errorStatus: true, message: (`Error occurred while fetching UMS: ${error}`) };
        }
    }

    async close() {
        await this.browser.close();
    }
}

// For testing purposes
// (async () => {
//     try {
//         // const umsScrapper = new UmsScrapper("YOUR_REGISTRATION_NUMBER", "YOUR_PASSWORD", false);
//         await umsScrapper.init();
//         await umsScrapper.login();
//         const studentDetails = await umsScrapper.get_user_info();
//         console.log(studentDetails);
//         // const timeTable = await umsScrapper.get_time_table();
//         // console.log(timeTable);
//         // const attendance = await umsScrapper.get_user_attendance();
//         // console.log(attendance);
//         umsScrapper.close()
//     } catch (error) {
//         console.error(error);
//     }
// })();

module.exports = UmsScrapper;