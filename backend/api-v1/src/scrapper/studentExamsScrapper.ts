import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentExams = async (cookie: string) => {
  try {
    const url = umsUrls.STUDENT_EXAMS; 
    const headers = {
      ...umsHeaders.USER_AGENT_JSON,
      Cookie: cookie,
    };

    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    const exams: any[] = [];

    $('tr[id^="ctl00_cphHeading_gvDisplaySeatingPlan_ctl00__"]').each((_, tr) => {
      const tds = $(tr).find('td');

      exams.push({
        course_code: $(tds[0]).text().trim(),
        course_name: $(tds[1]).text().trim(),
        exam_type: $(tds[2]).text().trim(),
        room_no: $(tds[3]).text().trim(),
        reporting_time: $(tds[4]).text().trim(),
        date: $(tds[5]).text().trim(),
        time: $(tds[6]).text().trim(),
        detainee_status: $(tds[7]).text().trim(),
        defaulter_detail: $(tds[8]).text().trim(),
      });
    });

    if (exams.length === 0) {
      return {
        success: false,
        data: {},
        message: "No exam data found",
        errorMessage: "No exam data found",
      };
    }

    return {
      data: { exams },
      message: "Successfully fetched exam details",
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    return {
      data: {},
      errorMessage: error.message,
      success: false,
    };
  }
};
