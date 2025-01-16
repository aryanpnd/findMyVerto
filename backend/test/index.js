// const { default: axios } = require("axios");
// const { wrapper } = require("axios-cookiejar-support");
// const Cheerio = require("cheerio");
// const { CookieJar } = require("tough-cookie");

// const UMS_STUDENT_TIME_TABLE = "https://ums.lpu.in/LpuUms/Reports/frmStudentTimeTable.aspx";
// const LOGIN_URL = "https://ums.lpu.in/lpuums/";
// const USER_AGENT_HEADERS = {
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
//     "Content-Type": "application/x-www-form-urlencoded",
// };

// const user = {
//     reg_no: "12203693",
//     password: "MrCat@9870",
// };

// const makeRequest = async () => {
//     const jar = new CookieJar();
//     const client = wrapper(axios.create({ jar, headers: USER_AGENT_HEADERS }));

//     try {
//         // Step 1: Initial GET request to retrieve view state and other tokens
//         let response = await client.get(LOGIN_URL);
//         let $ = Cheerio.load(response.data);

//         let __VIEWSTATE = $("#__VIEWSTATE").val();
//         let __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val();
//         let __EVENTVALIDATION = $("#__EVENTVALIDATION").val();

//         // Step 2: Send registration number only
//         const payloadWithRegNoOnly = new URLSearchParams({
//             "__LASTFOCUS": "",
//             "__EVENTTARGET": "txtU",
//             "__EVENTARGUMENT": "",
//             "__VIEWSTATE": __VIEWSTATE,
//             "__VIEWSTATEGENERATOR": __VIEWSTATEGENERATOR,
//             "__SCROLLPOSITIONX": "0",
//             "__SCROLLPOSITIONY": "0",
//             "__EVENTVALIDATION": __EVENTVALIDATION,
//             "txtU": user.reg_no,
//             "TxtpwdAutoId_8767": "",
//             "DropDownList1": "1",
//         });

//         response = await client.post(LOGIN_URL, payloadWithRegNoOnly.toString());

//         $ = Cheerio.load(response.data);
//         __VIEWSTATE = $("#__VIEWSTATE").val();
//         __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val();
//         __EVENTVALIDATION = $("#__EVENTVALIDATION").val();

//         // Step 3: Send registration number and password
//         const payloadWithPassword = new URLSearchParams({
//             "__LASTFOCUS": "",
//             "__EVENTTARGET": "",
//             "__EVENTARGUMENT": "",
//             "__VIEWSTATE": __VIEWSTATE,
//             "__VIEWSTATEGENERATOR": __VIEWSTATEGENERATOR,
//             "__SCROLLPOSITIONX": "0",
//             "__SCROLLPOSITIONY": "0",
//             "__EVENTVALIDATION": __EVENTVALIDATION,
//             "txtU": user.reg_no,
//             "TxtpwdAutoId_8767": user.password,
//             "ddlStartWith": "StudentDashboard.aspx",
//             "iBtnLogins150203125": "Login",
//         });

//         response = await client.post(LOGIN_URL, payloadWithPassword.toString());

//         // Verify if session cookie is present
//         const cookies = jar.getCookiesSync(LOGIN_URL);
//         const aspSessionCookie = cookies.find(cookie => cookie.key === "ASP.NET_SessionId");

//         if (!aspSessionCookie) {
//             throw new Error("Session cookie not found. Login might have failed.");
//         }

//         console.log("Session cookie:", aspSessionCookie);

//         // Step 4: Access the time table page
//         response = await client.get(UMS_STUDENT_TIME_TABLE);
//         $ = Cheerio.load(response.data);

//         const __VSTATE = $("input#__VSTATE").val();
//         const __EVENTVALIDATION_TT = $("input#__EVENTVALIDATION").val();

//         // Step 5: Submit payload for time table report
//         const payload = new URLSearchParams({
//             "__EVENTTARGET": "ReportViewerabcd$ctl09$Reserved_AsyncLoadTarget",
//             "__VSTATE": __VSTATE,
//             "__EVENTVALIDATION": __EVENTVALIDATION_TT,
//         });

//         response = await client.post(UMS_STUDENT_TIME_TABLE, payload.toString());

//         console.log("Time table data fetched successfully!");
//         return response.data;
//     } catch (error) {
//         console.error("Error:", error.message);
//         console.error("Details:", error.response?.data || error.stack);
//     }
// };

// (async () => {
//     const data = await makeRequest();
//     if (data) {
//         console.log(data);
//     }
// })();



const { default: axios } = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const Cheerio = require("cheerio");
const { CookieJar } = require("tough-cookie");

const UMS_STUDENT_TIME_TABLE = "https://ums.lpu.in/LpuUms/Reports/frmStudentTimeTable.aspx";
const USER_AGENT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
};

const makeRequestWithCookie = async (cookieString) => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar, headers: USER_AGENT_HEADERS }));

    try {
        // Manually set the session cookie in the jar
        jar.setCookieSync(cookieString, UMS_STUDENT_TIME_TABLE);

        // Access the time table page
        let response = await client.get(UMS_STUDENT_TIME_TABLE);
        let $ = Cheerio.load(response.data);

        const __VSTATE = $("input#__VSTATE").val();
        const __EVENTVALIDATION = $("input#__EVENTVALIDATION").val();

        if (!__VSTATE || !__EVENTVALIDATION) {
            throw new Error("Failed to fetch required tokens for time table submission.");
        }

        const regx = /ReportViewerabcd\$ctl..\$Reserved_AsyncLoadTarget/;
        const mo = response.data.match(regx);
        if (!mo) {
            throw new Error('Regex match failed');
        }
        const state_v = mo[0];

        // Submit payload for time table report
        const payload = new URLSearchParams({
            "__EVENTTARGET": state_v,
            "__VSTATE": __VSTATE,
            "__EVENTVALIDATION": __EVENTVALIDATION,
        });

        response = await client.post(UMS_STUDENT_TIME_TABLE, payload.toString());
        return response.data;
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Details:", error.response?.data || error.stack);
    }
};

(async () => {
    const cookie = "ASP.NET_SessionId=gz2zqquz5ifmhd2xxoe2yvwf"; // Replace this with your actual cookie
    const data = await makeRequestWithCookie(cookie);
    if (data) {
        console.log(data);
    }
})();
