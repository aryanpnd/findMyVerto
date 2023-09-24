import requests

# Create a session object
session = requests.Session()

# Define the cookies as a list of dictionaries
cookies = [
    {
      "domain": ".lpu.in",
      "expiry": 1695581352,
      "httpOnly": "false",
      "name": "_gat",
      "path": "/",
      "sameSite": "Lax",
      "secure": "false",
      "value": "1"
    },
    {
      "domain": ".lpu.in",
      "expiry": 1695667696,
      "httpOnly": "false",
      "name": "_gid",
      "path": "/",
      "sameSite": "Lax",
      "secure": "false",
      "value": "GA1.2.1603075889.1695581293"
    },
    {
      "domain": ".lpu.in",
      "expiry": 1730141296,
      "httpOnly": "false",
      "name": "_ga_B0Z6D6GCD8",
      "path": "/",
      "sameSite": "Lax",
      "secure": "false",
      "value": "GS1.2.1695581293.1.1.1695581296.57.0.0"
    },
    {
      "domain": ".lpu.in",
      "expiry": 1730141296,
      "httpOnly": "false",
      "name": "_ga",
      "path": "/",
      "sameSite": "Lax",
      "secure": "false",
      "value": "GA1.2.1300304598.1695581293"
    },
    {
      "domain": "ums.lpu.in",
      "httpOnly": "true",
      "name": "ASP.NET_SessionId",
      "path": "/",
      "sameSite": "Lax",
      "secure": "false",
      "value": "z0jk4qlv1dkxeszzsgbdi04x"
    }
  ]
  

# Add cookies to the session
for cookie in cookies:
    session.cookies.set(cookie['name'], cookie['value'], domain=cookie['domain'])

# Now you can use the session to make requests with the cookies
response = session.get('https://ums.lpu.in/lpuums/Reports/Loginnew.aspx')  # Replace with your URL

# Print the response or perform other operations as needed
print(response.text)
