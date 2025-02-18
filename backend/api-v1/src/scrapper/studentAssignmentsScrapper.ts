import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentAssignments = async (cookie: string) => {
  try {
    const url = umsUrls.STUDENT_ASSIGNMENTS; 

    const getHeaders = {
      ...umsHeaders.USER_AGENT_FORM_URL_ENCODED,
      Cookie: cookie,
    };

    const initialResponse = await axios.get(url, { headers: getHeaders });
    const initialHtml = initialResponse.data;
    const $initial = cheerio.load(initialHtml);

    const __VSTATE = $initial('input#__VSTATE').attr('value') || '';
    const __EVENTVALIDATION = $initial('input#__EVENTVALIDATION').attr('value') || '';

    const payloadParams = new URLSearchParams();
    payloadParams.append('__VSTATE', __VSTATE);
    payloadParams.append('__VIEWSTATE', ''); 
    payloadParams.append('__EVENTVALIDATION', __EVENTVALIDATION);
    payloadParams.append('ctl00$cphHeading$Button1', 'View All');

    const postHeaders = {
      ...umsHeaders.USER_AGENT_FORM_URL_ENCODED,
      Cookie: cookie,
    };

    const postResponse = await axios.post(url, payloadParams.toString(), {
      headers: postHeaders,
    });
    const postHtml = postResponse.data;
    const $ = cheerio.load(postHtml);

    const assignments: { theory: any[]; practical: any[] } = { theory: [], practical: [] };

    const theoryTable = $('table#ctl00_cphHeading_rgAssignment_ctl00').find('tbody');
    if (theoryTable.length) {
      theoryTable.find('tr[id^="ctl00_cphHeading_rgAssignment_ctl00__"]').each((_, tr) => {
        const tds = $(tr).find('td');

        
        if (tds.length >= 12) {
          const course_code = $(tds[1]).text().trim();
          const faculty_name = $(tds[2]).text().trim();
          const upload_date = $(tds[3]).text().trim();
          const submission_date = $(tds[4]).text().trim();
          const type = $(tds[5]).text().trim();
          const topic = $(tds[6]).text().trim();
          let comments = $(tds[7]).text().trim();
          const submission_type = $(tds[8]).text().trim();
          const marks_obtained = $(tds[9]).text().trim();
          const total_marks = $(tds[10]).text().trim();
          let teacher_comments = $(tds[11]).text().trim();

          let assignment_download_url = '';
          if (tds.length > 12) {
            const downloadInput = $(tds[12]).find('input');
            const downloadText = downloadInput.attr('text') || '';
            if (downloadText) {
              assignment_download_url = 'http://assignments.lpu.in/Teacher/' + encodeURI(downloadText);
            }
          }

          let assignment_uploaded_by_student = '';
          if (tds.length > 13) {
            const uploadedInput = $(tds[13]).find('input');
            const uploadedText = uploadedInput.attr('text') || '';
            if (uploadedText) {
              assignment_uploaded_by_student = 'http://assignments.lpu.in/Teacher/' + encodeURI(uploadedText);
            }
          }

          comments = comments.replace(/\s+/g, ' ').trim();
          teacher_comments = teacher_comments.replace(/\s+/g, ' ').trim();

          const theoryRecord = {
            course_code,
            faculty_name,
            upload_date,
            submission_date,
            type,
            topic,
            comments,
            submission_type,
            marks_obtained,
            total_marks,
            teacher_comments,
            assignment_download_url,
            assignment_uploaded_by_student,
          };

          assignments.theory.push(theoryRecord);
        }
      });
    }

    const practicalTable = $('table#ctl00_cphHeading_gvPracticalComponent_ctl00').find('tbody');
    if (practicalTable.length) {
      practicalTable.find('tr[id^="ctl00_cphHeading_gvPracticalComponent_ctl00__"]').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 18) {
          const course_code = $(tds[1]).text().trim();
          const faculty_name = $(tds[2]).text().trim();
          const title = $(tds[3]).text().trim();
          const comp_1_name = $(tds[4]).text().trim();
          const comp_1_marks = $(tds[5]).text().trim();
          const comp_1_total_marks = $(tds[6]).text().trim();
          const comp_2_name = $(tds[7]).text().trim();
          const comp_2_marks = $(tds[8]).text().trim();
          const comp_2_total_marks = $(tds[9]).text().trim();
          const comp_3_name = $(tds[10]).text().trim();
          const comp_3_marks = $(tds[11]).text().trim();
          const comp_3_total_marks = $(tds[12]).text().trim();
          const comp_4_name = $(tds[13]).text().trim();
          const comp_4_marks = $(tds[14]).text().trim();
          const comp_4_total_marks = $(tds[15]).text().trim();
          const marks_obtained = $(tds[16]).text().trim();
          const total_marks = $(tds[17]).text().trim();

          let practical_assignment_uploaded_by_student = '';
          if (tds.length > 18) {
            const link = $(tds[18]).find('a').attr('href') || '';
            if (link) {
              practical_assignment_uploaded_by_student = 'https://ums.lpu.in/' + encodeURI(link);
            }
          }

          const practicalRecord = {
            course_code,
            faculty_name,
            title,
            comp_1_name,
            comp_1_marks,
            comp_1_total_marks,
            comp_2_name,
            comp_2_marks,
            comp_2_total_marks,
            comp_3_name,
            comp_3_marks,
            comp_3_total_marks,
            comp_4_name,
            comp_4_marks,
            comp_4_total_marks,
            marks_obtained,
            total_marks,
            assignment_uploaded_by_student: practical_assignment_uploaded_by_student,
          };

          assignments.practical.push(practicalRecord);
        }
      });
    }

    return {
      data: assignments,
      message: "Successfully fetched assignments and marks",
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
