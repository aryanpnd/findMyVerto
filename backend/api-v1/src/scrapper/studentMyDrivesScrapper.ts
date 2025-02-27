import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

const sanitizeText = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

export const studentMyDrivesScrapper = async (cookie: string) => {
  try {
    const drivesUrl = umsUrls.STUDENT_DRIVES;
    const requestHeaders = {
      ...umsHeaders.USER_AGENT_JSON_PLAIN,
      Cookie: cookie,
    };

    const { data: html } = await axios.get(drivesUrl, { headers: requestHeaders });
    const $ = cheerio.load(html);

    const drivesTable = $('table#ctl00_ContentPlaceHolder1_gdvPlacement');
    const driveEntries: any[] = [];

    if (drivesTable.length > 0) {
      const rows = drivesTable.find('tr');
      const totalRows = rows.length;

      for (let i = 1; i < totalRows - 2; i++) {
        const cells = $(rows[i]).find('td');
        if (cells.length >= 10) {
          const driveCode = sanitizeText($(cells[0]).text());
          const driveDate = sanitizeText($(cells[1]).text());
          const registeredBy = sanitizeText($(cells[2]).text());
          const companyName = sanitizeText($(cells[3]).text());
          const eligibleStreams = sanitizeText($(cells[4]).text());
          const venueName = sanitizeText($(cells[5]).text());
          let jobProfileUrl = '';
          const jobAnchor = $(cells[6]).find('a');
          if (jobAnchor.length) {
            const href = jobAnchor.attr('href') || '';

            jobProfileUrl = 'https://ums.lpu.in/Placements/' + encodeURI(href);
          }
          const driveStatus = sanitizeText($(cells[7]).text());
          const eligibility = sanitizeText($(cells[8]).text());
          const registrationStatus = sanitizeText($(cells[9]).text());

          driveEntries.push({
            drive_code: driveCode,
            drive_date: driveDate,
            register_by: registeredBy,
            company: companyName,
            streams_eligible: eligibleStreams,
            venue: venueName,
            job_profile: jobProfileUrl,
            status: driveStatus,
            is_eligible: eligibility,
            registered: registrationStatus,
          });
        }
      }
    }

    return {
      data: driveEntries ,
      message: 'Placement drive details fetched successfully',
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
