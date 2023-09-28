from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup

class UmsScrapper:
    username=""
    password=""
    is_user_loggedIn=False

    def __init__(self,username,password,headless=True):
        self.username = username
        self.password = password

        opt = webdriver.ChromeOptions()
        prefs = {"profile.default_content_setting_values.notifications": 2}
        opt.add_experimental_option("prefs", prefs)
        opt.add_argument("log-level=3")
        opt.add_argument("--disable-popup-blocking")
        opt.add_experimental_option("detach", True)

        if headless:
            opt.add_argument("headless")
            opt.add_argument("--no-sandbox")  # Bypass OS security model
            opt.add_argument("--disable-gpu")  # applicable to windows os only
        else:
            pass

        opt.add_argument("--incognito")
        opt.add_argument("start-maximized")
        opt.add_experimental_option("useAutomationExtension", False)
        opt.add_experimental_option("excludeSwitches", ["enable-automation"])
        opt.add_argument("--silent")
        opt.add_argument("--disable-blink-features")
        opt.add_argument("--disable-blink-features=AutomationControlled")
        opt.add_argument("disable-infobars")

        try:
            self.driver = webdriver.Chrome(options=opt)
        except:
            print(f"Error occurred in the script, Try Again")


    def login(self):
        try:
            self.driver.get("https://ums.lpu.in/lpuums/")
        except:
            print(f"Error occurred while fetching UMS")
            return


        userNameField = WebDriverWait(self.driver, 30).until(
            EC.element_to_be_clickable(
                (
                    By.ID,
                    "txtU",
                )
            )
        )
        userNameField.send_keys(self.username)
        userNameField.send_keys(Keys.ENTER)

        passwordField = WebDriverWait(self.driver, 30).until(
            EC.element_to_be_clickable(
                (
                    By.ID,
                    "TxtpwdAutoId_8767",
                )
            )
        )
        passwordField.send_keys(self.password)

        loginBtn = WebDriverWait(self.driver, 30).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    '//*[@id="iBtnLogins"]',
                )
            )
        )

        self.driver.execute_script("arguments[0].click();", loginBtn)

        try:
            pName = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        '/html/body/div[3]/div/div[2]',
                    )
                )
            )
            print(f"{pName.text} \nIncorrect username or password")
            return False
        except:
            print("Login succeeded")
            self.is_user_loggedIn = True
            return True

    def get_user_info(self):
        if self.is_user_loggedIn==True:
            pass
        else:
            return "login first"
        
        try:
            self.driver.get("https://ums.lpu.in/lpuums/default3.aspx")
        except:
            print(f"Error occurred while fetching UMS")
            return
        
        student_details = []

        student_name = self.driver.find_element(By.XPATH,'//*[@id="ctl00_cphHeading_Logoutout1_lblId"]')
        student_details.append({"name":student_name.text.split(' (')[0]})

        student_details.append({"registration no.":self.username})

        student_section = self.driver.find_element(By.XPATH,'//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[1]/p')
        student_details.append({"section and group.":student_section.text})

        student_program = self.driver.find_element(By.XPATH,'//*[@id="middle_profile"]/div[1]/div[2]/ul[1]/li[3]/p/a')
        student_details.append({"program":student_program.text})

        student_ums_pass_exp = self.driver.find_element(By.XPATH,'//*[@id="ctl00_cphHeading_wcUserPasswordDetail1_Label1"]')
        student_details.append({"pass expire":student_ums_pass_exp.text})


        return student_details

    def get_time_table(self):

        if self.is_user_loggedIn==True:
            pass
        else:
            return "login first"


        self.driver.get("https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx")
        while True:
            try:
                table = WebDriverWait(self.driver, 30).until(
                    EC.element_to_be_clickable(
                        (
                            By.XPATH,
                            '/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table',
                        )
                    )
                )
                break
            except:
                self.driver.refresh()
        timetable = self.tableParser(table.get_attribute("outerHTML"))  
        return timetable
        

    def tableParser(self,html):
        time_table = [
            {"Monday":{}},
            {"Tuesday":{}},
            {"Wednesday":{}},
            {"Thursday":{}},
            {"Friday":{}},
            {"Saturday":{}},
            {"Sunday":{}}
        ]

        soup = BeautifulSoup(html, 'html.parser')

        rows = soup.find_all('tr')[2:]  # Skip the first two rows with headers


        for time_slot in rows:
            temp_soup = BeautifulSoup(str(time_slot), 'html.parser')
            columns = temp_soup.find_all('td')[1:]  # Skip the first two rows with headers
            for index, day in enumerate(time_table):
                day_name = list(day.keys())[0]  # Get the name of the day
                day[day_name][columns[0].text] = columns[index+1].text #columns[0].text = the time slot


        return time_table


    def close(self):
        self.driver.quit()
            


if __name__ == "__main__":

    umsScrapper = UmsScrapper("12203987","0Password@123",False)
    umsScrapper.login()
    print(umsScrapper.get_user_info())

    umsScrapper.close()