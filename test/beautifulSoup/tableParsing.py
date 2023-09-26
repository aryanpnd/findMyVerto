from bs4 import BeautifulSoup

# Sample HTML table, replace this with your actual HTML content
html_content = """
<table cellspacing="0" cellpadding="0" cols="9" border="0" style="border-collapse:collapse;"
    class="A8c6e49135c5c4cfaaf04989ba8451e85139">
    <tbody>
        <tr height="0">
            <td style="WIDTH:0px"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
            <td style="WIDTH:28.12mm;min-width:28.12mm"></td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8567c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8567">Timing</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8571c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8571">Monday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8575c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8575">Tuesday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8579c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8579">Wednesday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8583c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8583">Thursday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8587c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8587">Friday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8591c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8591">Saturday</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e8595c">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e8595">Sunday</div>
            </td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">08-09 AM</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85104cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85104">
                    Practical / G:0 C:INT216 / R: 38-817 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85108cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85112cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85116cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Practical / G:2 C:CSE325 / R: 34-306 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">09-10 AM</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85104cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85104">
                    Practical / G:0 C:INT216 / R: 38-817 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85108cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85108">
                    Lecture / G:All C:CSE229 / R: 38-806 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85112cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85116cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85116">
                    Lecture / G:All C:CSE228 / R: 38-809 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Practical / G:2 C:CSE325 / R: 34-306 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">10-11 AM</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85104cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85104">
                    Practical / G:0 C:CSE228 / R: 38-813 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85108cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85108">
                    Lecture / G:All C:CSE229 / R: 38-806 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85112cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85116cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85116">
                    Lecture / G:All C:CSE228 / R: 38-809 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Practical / G:0 C:CSE229 / R: 37-910 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">11-12 AM</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85104cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85104">
                    Practical / G:0 C:CSE228 / R: 38-813 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85108cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85112cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85116cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Practical / G:0 C:CSE229 / R: 37-910 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">12-01 PM</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85104cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85104">
                    Lecture / G:All C:CSE211 / R: 38-803 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85108cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85108">
                    Practical / G:0 C:CSE228 / R: 34-807 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85112cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85112">
                    Lecture / G:All C:CSE316 / R: 34-607 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85116cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85116">
                    Lecture / G:All C:CSE316 / R: 38-916 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Lecture / G:All C:CSE316 / R: 34-406X / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">01-02 PM</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85104cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85108cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85112cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85112">
                    Lecture / G:All C:CSE211 / R: 34-501A / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85116cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85116">
                    Lecture / G:All C:CSE211 / R: 36-702A / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Tutorial / G:0 C:CSE211 / R: 34-807 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">02-03 PM</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85104cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85108cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85108">
                    Practical / G:2 C:PEL134 / R: 33-310 / S:KE020</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85112cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85116cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85120cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">03-04 PM</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85104cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85108cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85108">
                    Practical / G:2 C:PEL134 / R: 33-310 / S:KE020</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85112cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85112">
                    Lecture / G:All C:PEL134 / R: 33-309 / S:KE020</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85116cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85120cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85120">
                    Practical / G:2 C:PEL134 / R: 38-909 / S:KE020</div>
            </td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
        <tr valign="top">
            <td style="HEIGHT:5.29mm"></td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85100cl">
                <div class="A8c6e49135c5c4cfaaf04989ba8451e85100">04-05 PM</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85104cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85108cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85112cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85112">
                    Practical / G:0 C:CSE229 / R: 38-806 / S:K22UP</div>
            </td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85116cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;"
                class="A8c6e49135c5c4cfaaf04989ba8451e85120cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
            <td style="background-color:Transparent;" class="A8c6e49135c5c4cfaaf04989ba8451e85124cl">
                <div style="word-wrap:break-word;white-space:pre-wrap;" class="A8c6e49135c5c4cfaaf04989ba8451e85124">
                    Project Work/ Other Weekly Activities. Check Schedule Below</div>
            </td>
            <td class="A8c6e49135c5c4cfaaf04989ba8451e85128cl P4036e5f1808a4cd89649fd348cde9944_1_r14">&nbsp;</td>
        </tr>
    </tbody>
</table>
"""

# Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Initialize an empty list to store the timetable
timetable = []

# Extract data from the table
rows = soup.find_all('tr')[2:]  # Skip the first two rows with headers
days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

for i, day in enumerate(days_of_week):
    day_schedule = {}
    day_schedule[day] = {}

    for j in range(1, 9):  # Loop through the 8 time slots
        time_slot = soup.find_all('td', class_='A8c6e49135c5c4cfaaf04989ba8451e85100cl')[j].text.strip()
        
        # Error handling for subject info extraction
        subject_info_element = soup.find_all('td', class_='A8c6e49135c5c4cfaaf04989ba8451e85120cl')[j].div
        if subject_info_element:
            subject_info = subject_info_element.text.strip()
            room = subject_info.split(" / ")[-2]
            subject = subject_info.split(" / ")[-3]
            day_schedule[day][time_slot] = {"room": room, "subject": subject}
        else:
            day_schedule[day][time_slot] = {}

    timetable.append(day_schedule)

# Print the parsed timetable
# print(timetable)
for day_schedule in timetable:
    print(day_schedule)





