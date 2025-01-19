import cheerio from 'react-native-cheerio';
import { umsHeaders } from "../constants/headers";
import { umsLogin } from "./umsLogin";
import axios from 'axios';
import { umsUrls } from '../constants/umsUrls';

export const scrapeStudentTimetable = async (user) => {
    try {
        const login = await umsLogin({ reg_no: user.reg_no, password: user.password });
        if (!login.login) {
            throw new Error('Failed to login: ' + login.message);
        }

        const requestedTimetable = await requestTimetable(login.cookie)
        // const parsedTimetable = await parseTimetable(requestedTimetable)

        return {
            data: requestedTimetable,
            requestTime: new Date().toISOString(),
            message: "Data fetched successfully",
            status: false
        }
    } catch (error) {
        console.error(error);
        return {
            data: {},
            requestTime: "",
            message: "Unable to fetch the data",
            status: false,
            errorMessage: error.message
        }
    }
}

export const requestTimetable = async (cookie) => {
    const headers = { ...umsHeaders.USER_AGENT_JSON_PLAIN };

    // Manually set the session cookie in the headers
    headers['Cookie'] = cookie;

    try {
        // Access the timetable page with the session cookie
        const initialResponse = await axios.get(umsUrls.STUDENT_TIME_TABLE, { headers });

        const $ = cheerio.load(initialResponse.data);

        const regx = /ReportViewerabcd\$ctl..\$Reserved_AsyncLoadTarget/;
        const mo = initialResponse.data.match(regx);
        if (!mo) {
            throw new Error('Regex match failed');
        }
        const state_v = mo[0];

        const __VSTATE = $('input#__VSTATE').val();
        const __EVENTVALIDATION = $('input#__EVENTVALIDATION').val();

        const payload = new URLSearchParams({
            '__EVENTTARGET': state_v,
            '__VSTATE': __VSTATE,
            '__EVENTVALIDATION': __EVENTVALIDATION,
        });

        // Send the POST request with the session cookie and payload
        const response = await axios.post(umsUrls.STUDENT_TIME_TABLE, payload.toString(), {
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error making request:', error);
        return null;
    }
};