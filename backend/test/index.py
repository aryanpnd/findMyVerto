import aiohttp
from bs4 import BeautifulSoup
import re

# Constants
USER_AGENT_ONLY = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}
UMS_STUDENT_TIME_TABLE = "https://ums.lpu.in/LpuUms/Reports/frmStudentTimeTable.aspx"


async def make_request(cookie):
    async with aiohttp.ClientSession() as session:
        header = USER_AGENT_ONLY
        header["Cookie"] = cookie
        async with session.post(
            UMS_STUDENT_TIME_TABLE,
            headers=header,
        ) as res:
            html1 = await res.text()
            soup = BeautifulSoup(html1, "lxml")
            import re

            regx = re.compile(r"ReportViewerabcd\$ctl..\$Reserved_AsyncLoadTarget")

            mo = regx.search(html1)
            state_v = str(mo.group())
            __VSTATE = soup.find("input", {"id": "__VSTATE"})["value"]
            __EVENTVALIDATION = soup.find("input", {"id": "__EVENTVALIDATION"})["value"]

            payload = {
                # "ReportViewerabcd$ctl03$ctl00": "Refresh",
                "__EVENTTARGET": state_v,
                "__VSTATE": __VSTATE,
                "__EVENTVALIDATION": __EVENTVALIDATION,
            }
            is_On = True
            header = USER_AGENT_ONLY
            header["Cookie"] = cookie
            counter = 1
            while is_On:
                async with session.post(
                    UMS_STUDENT_TIME_TABLE, headers=header, data=payload
                ) as res:
                    html = await res.text()
                    soup = BeautifulSoup(html, "lxml")
                    title = soup.find("title").get_text(strip=True)
                    if not title.startswith("UMS"):
                        print("making request number " + str(counter) + " :")
                        if counter > 5:
                            return None
                        counter += 1
                        continue
                    is_On = False
                    soup.decompose()
                    await session.close()
                    print(html)
                    return html


# Example usage
import asyncio
asyncio.run(make_request("ASP.NET_SessionId=p4xq1ffxxcsuq21yhhlllttz"))
