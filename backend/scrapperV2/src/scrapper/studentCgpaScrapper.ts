import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentCgpa = async (cookie: string) => {
    try {
        const url = umsUrls.STUDENT_CGPA;
        const headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: cookie
        };

        const response = await axios.post(url, {}, { headers });
        if (!response.data.d || response.data.d === null) {
            return {
                success: false,
                data: {},
                errorMessage: 'No data found'
            };
        }
        const html = response.data.d;
        const $ = cheerio.load(html);

        const TERM_ID: { [key: number]: string } = {
            1: 'Term : I', 2: 'Term : II', 3: 'Term : III', 4: 'Term : IV',
            5: 'Term : V', 6: 'Term : VI', 7: 'Term : VII', 8: 'Term : VIII',
            9: 'Term : IX', 10: 'Term : X', 11: 'Term : XI', 12: 'Term : XII',
            13: 'Term : XIII', 14: 'Term : XIV', 15: 'Term : XV', 16: 'Term : XVI'
        };

        const cgpaData: { cgpa: { [termId: string]: any } } = { cgpa: {} };

        $('div.row').each((_, termDiv) => {
            const h4s = $(termDiv).find('h4');
            const termId = h4s.eq(0).text().trim();
            const tgpa = h4s.eq(1).text().trim();
            const termIdNested = termId.split(':').pop()?.trim() || '';
            const termGpa = tgpa.split(':').pop()?.trim() || '';

            cgpaData.cgpa[termId] = {
                term: termIdNested,
                tgpa: termGpa,
                course_grades: []
            };
        });

        $('div.table-responsive').each((idx, gradeDiv) => {
            const trs = $(gradeDiv).find('tbody tr');
            trs.each((_, tr) => {
                const tds = $(tr).find('td');
                const courseNameSplit = $(tds[0]).text().trim().split(':');
                const courseCode = courseNameSplit[0].trim();
                const courseName = courseNameSplit.slice(1).join(':').trim();
                const grade = $(tds[1]).text().trim().split(':').pop()?.trim() || '';

                cgpaData.cgpa[TERM_ID[idx + 1]]?.course_grades.push({
                    course_code: courseCode,
                    course_name: courseName,
                    grade: grade
                });
            });
        });

        return {
            data: cgpaData,
            message: "Successfully fetched cgpa",
            success: true
        };
    } catch (error: any) {
        console.error(error);
        return {
            data: {},
            errorMessage: error.message,
            success: false
        };
    }
};
