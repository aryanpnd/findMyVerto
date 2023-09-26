from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import pandas as pd

class UmsScrapper:
    username=""
    password=""

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


    def _login(self):
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
            return True

    def get_time_table(self):
        user_login = self._login()

        if user_login:
            self.driver.get("https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx")

            table = WebDriverWait(self.driver, 30).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        '/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table',
                    )
                )
            )
            return table.get_attribute("outerHTML")
        else:
            return "login failed"

    def close(self):
        self.driver.quit()
            


if __name__ == "__main__":

    umsScrapper = UmsScrapper("12203987","0Password@123",False)

    timeTable = umsScrapper.get_time_table()

    file_path = "timeTable.csv"

    timeTable = pd.read_html(timeTable)[0]

    timeTable.to_csv(file_path, index=False)

    print(f'DataFrame has been written to {file_path}')


    umsScrapper.close()