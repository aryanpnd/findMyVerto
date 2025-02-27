import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentMakeup = async (cookie: string) => {
  try {
    const makeupUrl = umsUrls.STUDENT_MAKEUPS; 

    const requestHeaders = {
      ...umsHeaders.USER_AGENT_JSON_PLAIN,
      Cookie: cookie,
    };

    const response = await axios.get(makeupUrl, { headers: requestHeaders });
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    const makeupClasses: any[] = [];

    const makeupTable = $('table.aspGridView');
    if (!makeupTable.length) {
      return {
        data: { makeup: makeupClasses },
        message: 'No makeup classes found',
        success: true,
      };
    }

    makeupTable.find('tr').slice(1).each((_, row) => {
      const cells = $(row).find('td');

      if (cells.length >= 9) {
        const makeupRecord = {
          category: $(cells[0]).text().trim(),
          scheduledDate: $(cells[1]).text().trim(),
          lectureTime: $(cells[2]).text().trim(),
          roomNumber: $(cells[3]).text().trim(),
          section: $(cells[4]).text().trim(),
          groupNumber: $(cells[5]).text().trim(),
          courseCode: $(cells[6]).text().trim(),
          attendanceType: $(cells[7]).text().trim(),
          takenBy: '',
          uid: '',
        };

        // The last cell contains a string with the name and uid separated by a colon
        const details = $(cells[8]).text().trim().split(':');
        if (details.length) {
          makeupRecord.takenBy = details[0].trim();
          makeupRecord.uid = details[details.length - 1].trim();
        }
        makeupClasses.push(makeupRecord);
      }
    });

    return {
      data: makeupClasses,
      message: 'Makeup classes fetched successfully',
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
