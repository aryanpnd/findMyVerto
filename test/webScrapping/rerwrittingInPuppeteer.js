const puppeteer = require('puppeteer');

class UmsScrapper {
  constructor(username, password, headless = true) {
    this.username = username;
    this.password = password;
    this.headless = headless;
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: ['--no-sandbox', '--disable-gpu', '--disable-infobars'],
    });
    this.page = await this.browser.newPage();
    await this.page.goto('https://ums.lpu.in/lpuums/');
  }

  async login() {
    await this.page.waitForSelector('#txtU');
    await this.page.type('#txtU', this.username);
    await this.page.keyboard.press('Enter');
    await this.page.waitForSelector('#TxtpwdAutoId_8767');
    await this.page.type('#TxtpwdAutoId_8767', this.password);
    await this.page.click('//*[@id="iBtnLogins"]');
    await this.page.waitForTimeout(5000); // Adjust the timeout as needed

    const loginError = await this.page.$x('/html/body/div[3]/div/div[2]');
    if (loginError.length > 0) {
      const pName = await loginError[0].evaluate(el => el.textContent);
      console.log(`${pName} \nIncorrect username or password`);
      return false;
    } else {
      console.log('Login succeeded');
      return true;
    }
  }

  async tableParser() {
    const time_table = [
      { 'Monday': {} },
      { 'Tuesday': {} },
      { 'Wednesday': {} },
      { 'Thursday': {} },
      { 'Friday': {} },
      { 'Saturday': {} },
      { 'Sunday': {} },
    ];

    const html = await this.page.content();
    const puppeteer = require('puppeteer');

    const soup = new JSDOM(html).window.document;
    const rows = soup.querySelectorAll('tr');

    for (let i = 2; i < rows.length; i++) {
      const columns = rows[i].querySelectorAll('td');
      for (let j = 1; j < columns.length; j++) {
        time_table[j - 1][Object.keys(time_table[j - 1])[0]][columns[0].textContent] = columns[j].textContent;
      }
    }

    return time_table;
  }

  async getTimeTable() {
    await this.init();
    const userLogin = await this.login();

    if (userLogin) {
      await this.page.goto('https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx');

      while (true) {
        try {
          await this.page.waitForSelector('/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table');
          break;
        } catch (error) {
          await this.page.reload();
        }
      }

      const timetable = await this.tableParser();
      return timetable;
    } else {
      return 'Login failed';
    }
  }

  async close() {
    await this.browser.close();
  }
}

const umsScrapper = new UmsScrapper('your_username', 'your_password', true);
umsScrapper.getTimeTable().then((timetable) => {
  console.log(timetable);
  umsScrapper.close();
}).catch((error) => {
  console.error(error);
  umsScrapper.close();
});
