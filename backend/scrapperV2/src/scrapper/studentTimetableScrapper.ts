import axios from "axios";
import { umsHeaders } from "../constants/headers";
import { umsUrls } from "../constants/umsUrls";
import { umsLogin } from "./umsLogin";
import { TimeTable, umsLoginReturn, User } from "../types/scrapperTypes";
import { load } from 'cheerio'
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

export const scrapeStudentTimetable = async (user: User) => {
    try {
        const login: umsLoginReturn = await umsLogin({ reg_no: user.reg_no, password: user.password });
        if (!login.login) {
            return {
                data: {},
                requestTime: "",
                message: "Failed to login: ",
                status: false,
                errorMessage: login.message
            }
        }

        const requestedTimetable = await requestTimetable(login.cookie)
        const parsedTimetable = await parseTimetable(requestedTimetable)

        return {
            data: parsedTimetable,
            requestTime: new Date().toISOString(),
            message: "Data fetched successfully",
            status: true
        }
    } catch (error: any) {
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


const requestTimetable = async (cookie: string) => {
    const headers: any = umsHeaders;

    try {
        const jar = new CookieJar();
        const client = wrapper(axios.create({ jar, headers: headers.USER_AGENT_JSON_PLAIN }));
        // Manually set the session cookie in the jar
        jar.setCookieSync(cookie, umsUrls.STUDENT_TIME_TABLE);

        // Access the time table page
        const initialResponse = await client.get(umsUrls.STUDENT_TIME_TABLE);

        const $ = load(initialResponse.data);

        const regx = /ReportViewerabcd\$ctl..\$Reserved_AsyncLoadTarget/;
        const mo = initialResponse.data.match(regx);
        if (!mo) {
            throw new Error('Regex match failed');
        }
        const state_v = mo[0];

        const __VSTATE = $('input#__VSTATE').val();
        const __EVENTVALIDATION = $('input#__EVENTVALIDATION').val();

        const payload = new URLSearchParams({
            "__EVENTTARGET": state_v,
            "__VSTATE": __VSTATE as any,
            "__EVENTVALIDATION": __EVENTVALIDATION as any
        });

        const response = await client.post(umsUrls.STUDENT_TIME_TABLE, payload.toString());
        return response.data

    } catch (error) {
        console.error('Error making request:', error);
        throw error;
    }
};


const parseTimetable = async (html: string): Promise<TimeTable | null> => {
    try {
        if (!html) return null;

        const $ = load(html);


        const section = $('td > table').eq(4).text().trim();
        const lastUpdated = $('td > table').eq(10).text().trim();
        const regNo = $('td > table').eq(2).text().trim();

        const timeTable: TimeTable = {
            time_table: {
                "Monday": {},
                "Tuesday": {},
                "Wednesday": {},
                "Thursday": {},
                "Friday": {},
                "Saturday": {},
                "Sunday": {},
            },
            courses: {},
            section,
            last_updated: lastUpdated,
            registration_number: regNo,
        };

        const timeTableDivs = $('div[class$="100"]');
        timeTableDivs.each((_, div) => {
            const timing = $(div).text().trim();
            for (let idxWeek = 1; idxWeek <= 7; idxWeek++) {
                timeTable.time_table[Object.keys(timeTable.time_table)[idxWeek - 1]][timing] = "";
            }
        });

        const tables = $('td > table');
        tables.eq(15).find('tr').slice(2).each((_, tr) => {
            let timing: string | null = null;
            $(tr).find('td').each((idx, td) => {
                const div = $(td).find('div');
                let subjectName = div.text().trim();
                if (idx === 0) {
                    timing = div.text().trim();
                } else {
                    const day = Object.keys(timeTable.time_table)[idx - 1];
                    if (subjectName.startsWith("Project Work/ Other Weekly Activities")) {
                        subjectName = "";
                    }
                    if (timing) {
                        timeTable.time_table[day][timing] = subjectName;
                    }
                }
            });
        });

        const courseDetails: Record<string, any> = {};
        tables.eq(20).find('tr').slice(2).each((_, tr) => {
            let courseCode: string | null = null;
            $(tr).find('td').each((idx, td) => {
                const div = $(td).find('div');
                const text = div.text().trim();
                if (idx === 0) {
                    courseCode = text;
                    courseDetails[courseCode] = {};
                } else if (courseCode) {
                    if (idx === 1) courseDetails[courseCode]["course_type"] = text;
                    if (idx === 2) courseDetails[courseCode]["course_title"] = text;
                    if (idx === 3) courseDetails[courseCode]["lectures"] = text;
                    if (idx === 4) courseDetails[courseCode]["tutorials"] = text;
                    if (idx === 5) courseDetails[courseCode]["practical"] = text;
                    if (idx === 6) courseDetails[courseCode]["credits"] = text;
                    if (idx === 7) {
                        const span = div.find('span');
                        courseDetails[courseCode]["faculty_name"] = span.eq(0)?.text()?.split("(")[0]?.trim();
                        courseDetails[courseCode]["cabin"] = span.eq(0)?.text().split("(")[1]?.replace(")", "").trim();
                        courseDetails[courseCode]["last_updated"] = span.eq(-1)?.text().split("::").pop()?.trim();
                    }
                }
            });
        });

        timeTable.courses = courseDetails;
        return timeTable;
    } catch (error) {
        console.error('Error getting timetable details:', error);
        return null;
    }
};
