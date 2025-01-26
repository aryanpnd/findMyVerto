import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';
import { StudentAttendanceSummary } from '../types/scrapperTypes';

export const scrapeAttendanceSummary = async (cookie: string) => {
    try {
        const url = umsUrls.STUDENT_ATTENDANCE_SUMMARY;
        const headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: cookie
        };

        const response = await axios.post(url, {}, { headers });
        if (!response.data.d || response.data.d === null) return { status: false, errorMessage: 'No data found' };
        const html = response.data.d;

        // Fix malformed HTML by wrapping in <table> tag
        const fixedHtml = `<table>${html}</table>`;
        const $ = cheerio.load(fixedHtml);

        const attendance: StudentAttendanceSummary = {
            attendance_summary: [],
            total_details: null,
        };

        $('tr').each((idx, tr) => {
            const tds = $(tr).find('td');
            if (tds.length < 6) return;  // Skip empty or invalid rows

            if ($(tds[0]).text().trim().includes('* Aggregate Attendance')) {
                attendance.total_details = {
                    duty_leaves: $(tds[2]).text().trim(),
                    total_attended: $(tds[4]).text().trim(),
                    total_delivered: $(tds[3]).text().trim(),
                    agg_attendance: $(tds[5]).text().trim()
                };
            } else {
                const subject_name_and_code = $(tds[0]).text().trim().split(':');
                attendance.attendance_summary.push({
                    subject_code: subject_name_and_code[0],
                    subject_name: subject_name_and_code[1] || '',
                    last_attended: $(tds[1]).text().trim(),
                    duty_leaves: $(tds[2]).text().trim(),
                    total_attended: $(tds[4]).text().trim(),
                    total_delivered: $(tds[3]).text().trim(),
                    agg_attendance: $(tds[5]).text().trim()
                });
            }
        });

        return {
            attendance_summary: attendance.attendance_summary,
            total_details: attendance.total_details,
            status: true
        };
    } catch (error: any) {
        console.log(error);
        return {
            attendance_summary: [],
            total_details: null,
            errorMessage: error.message,
            status: false
        }
    }
};


export const scrapeAttendanceDetail = async (cookie: string) => {
    try {

        const url = umsUrls.STUDENT_ATTENDANCE_DETAILS;
        const headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: cookie
        };

        const response = await axios.post(url, {}, { headers });
        if (!response.data.d || response.data.d === null) return { status: false, errorMessage: 'No data found' };
        const html = response.data.d;
        const $ = cheerio.load(html);
        const attendance_details: { [key: string]: any[] } = {};

        $('div.border').each((_, div) => {
            const course_code_and_text = $(div).find('p.main-heading').text().trim();
            const course_code = course_code_and_text.split(':').pop()?.trim() || '';
            attendance_details[course_code] = [];

            const selected_div = $(div).find(`div#collapse${course_code}`);
            selected_div.find('tbody tr').each((_, tr) => {
                const tds = $(tr).find('td');
                attendance_details[course_code].push({
                    date: $(tds[0]).text().trim(),
                    timing: $(tds[1]).text().trim(),
                    type: $(tds[2]).text().trim(),
                    attendance: $(tds[3]).text().trim(),
                    faculty_name: $(tds[4]).text().trim(),
                    block_reason: $(tds[5]).text().trim()
                });
            });
        });

        return {
            attendance_details,
            status: true
        };
    } catch (error: any) {
        console.log(error);
        return {
            errorMessage: error.message,
            status: false
        }
    }
};