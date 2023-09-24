from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

import pandas as pd

opt = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications": 2}
opt.add_experimental_option("prefs", prefs)
opt.add_argument("log-level=3")
opt.add_argument("--disable-popup-blocking")
opt.add_experimental_option("detach", True)

# opt.add_argument("headless")
# opt.add_argument("--no-sandbox")  # Bypass OS security model
# opt.add_argument("--disable-gpu")  # applicable to windows os only

opt.add_argument("--incognito")
opt.add_argument("start-maximized")
opt.add_experimental_option("useAutomationExtension", False)
opt.add_experimental_option("excludeSwitches", ["enable-automation"])
opt.add_argument("--silent")
opt.add_argument("--disable-blink-features")
opt.add_argument("--disable-blink-features=AutomationControlled")
opt.add_argument("disable-infobars")
driver=webdriver.Chrome(options=opt)



username = "12203693"
password = ".V4mwB8$B$.75vE"

driver.get("https://ums.lpu.in/lpuums/")




userNameField = WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (
            By.ID,
            "txtU",
        )
    )
)
userNameField.send_keys(username)
userNameField.send_keys(Keys.ENTER)

passwordField = WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (
            By.ID,
            "TxtpwdAutoId_8767",
        )
    )
)
passwordField.send_keys(password)

loginBtn = WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (
            By.XPATH,
            '//*[@id="iBtnLogins"]',
        )
    )
)

driver.execute_script("arguments[0].click();", loginBtn)



cookies = driver.get_cookies()

driver.get("https://ums.lpu.in/lpuums/Reports/frmStudentTimeTable.aspx")




table = WebDriverWait(driver, 30).until(
    EC.element_to_be_clickable(
        (
            By.XPATH,
            '/html/body/form/table/tbody/tr[5]/td/span/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table',
        )
    )
)

timeTable = pd.read_html(table.get_attribute("outerHTML"))[0]
driver.quit()

file_path = "timeTable.csv"

timeTable.to_csv(file_path, index=False)

print(f'DataFrame has been written to {file_path}')
