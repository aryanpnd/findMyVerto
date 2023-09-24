import requests
from bs4 import BeautifulSoup

url = "https://ums.lpu.in"
response = requests.get(url)

soup = BeautifulSoup(response.content, "html.parser")

links = soup.find_all("a")
count=0
for link in links:
    count=count+1;
    print(links.get("href"))
print(count)
