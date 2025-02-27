import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentPendingAssignments = async (cookie: string) => {
  try {
    const url = umsUrls.STUDENT_PENDING_ASSIGNMENTS;
    const headers = {
      ...umsHeaders.USER_AGENT_JSON,
      Cookie: cookie,
    };

    const response = await axios.post(url, {}, { headers });
    console.log(response.data);
    
    if (!response.data.d) {
      return {
        success: false,
        data: {},
        message: "No assignment data found",
        errorMessage: "No assignment data found",
      };
    }

    const html = response.data.d;
    const $ = cheerio.load(html);

    const assignments: { course_code: string; assignment_name: string }[] = [];

    // Find all div elements with class "mycoursesdiv"
    $('div.mycoursesdiv').each((_, element) => {
      const course_code = $(element).find('div.right-arrow').text().trim();
      const assignment_name = $(element).find('p').text().trim();
      assignments.push({
        course_code,
        assignment_name,
      });
    });

    if (assignments.length === 0) {
      return {
        success: false,
        data: {},
        message: "No assignments found",
        errorMessage: "No assignments found",
      };
    }

    return {
      data: { assignments },
      message: "Successfully fetched pending assignments",
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
