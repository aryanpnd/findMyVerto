import requests
from bs4 import BeautifulSoup
import time

cookies = {
    '_ga': 'GA1.2.761054705.1695569295',
    'device_id': 'q5mc9668j1.1695645883758',
    'ASP.NET_SessionId': 'ptqc2anzsybv0gj01akop5q4',
    '_gid': 'GA1.2.463423113.1695749854',
    '_gat': '1',
    '_ga_B0Z6D6GCD8': 'GS1.2.1695749855.7.1.1695750503.60.0.0',
}

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    # 'Cookie': '_ga=GA1.2.761054705.1695569295; device_id=q5mc9668j1.1695645883758; ASP.NET_SessionId=ptqc2anzsybv0gj01akop5q4; _gid=GA1.2.463423113.1695749854; _gat=1; _ga_B0Z6D6GCD8=GS1.2.1695749855.7.1.1695750503.60.0.0',
    'Referer': 'https://ums.lpu.in/lpuums/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/188.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

response = requests.get('https://ums.lpu.in/LpuUms/Reports/frmStudentTimeTable.aspx', cookies=cookies, headers=headers)

if response.status_code == 200:
    time.sleep(6) 
    # Define the filename where you want to save the content
    filename = "response.html"

    # Open the file in write mode and write the response content to it
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(response.text)

    print(f"Response content has been saved to {filename}")
else:
    print(f"Failed to retrieve content. Status code: {response.status_code}")