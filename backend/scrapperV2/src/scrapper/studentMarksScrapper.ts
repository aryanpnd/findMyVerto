import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentMarks = async (cookie: string) => {
    try {
        const url = umsUrls.STUDENT_MARKS;
        const headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: cookie
        };

        const response = await axios.post(url, {}, { headers });
        if (!response.data.d || response.data.d === null) {
            return { 
                success: false, 
                data: {}, 
                message:"No data found",
                errorMessage: 'No data found'
             };
        }
        const html = response.data.d;
       
        const $ = cheerio.load(html);
        const marksTermWise: { [termId: string]: { [courseName: string]: any[] } } = {};

        $('div.border').each((_, termDiv) => {
            const termNameWithId = $(termDiv).find('p.main-heading').text().trim();
            const termId = termNameWithId.split(':').pop()?.trim() || '';
            marksTermWise[termId] = {};

            $(termDiv).find('div.divdetail').each((_, detailDiv) => {
                const courseName = $(detailDiv).find('h4').text().trim();
                marksTermWise[termId][courseName] = [];

                $(detailDiv).find('tbody tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    marksTermWise[termId][courseName].push({
                        type: $(tds[0]).text().trim(),
                        marks: $(tds[1]).text().trim(),
                        weightage: $(tds[2]).text().trim(),
                    });
                });
            });
        });
        return {
            data: marksTermWise,
            message:"Successfully fetched marks",
            success: true
        };
    } catch (error: any) {
        console.error(error);
        return {
            marksTermWise: {},
            errorMessage: error.message,
            success: false
        };
    }
};