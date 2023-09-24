import requests

login_url = "https://ums.lpu.in/lpuums/default3.aspx"
login_data = {
    "username": "12203693",
    "password": ".V4mwB8$B$.75vE"
}

response = requests.post(login_url, data=login_data)

if response.status_code == 200:
    print("Login successful!")
    print(response.text)  # Print the response content
else:
    print("Login failed.")
