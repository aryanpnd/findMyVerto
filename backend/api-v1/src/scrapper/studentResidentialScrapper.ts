import axios from 'axios';
import * as cheerio from 'cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';

export const scrapeStudentLeaveSlip = async (cookie: string) => {
  try {
    const url = umsUrls.STUDENT_LEAVE_SLIP; // URL for the hostel leave slip page
    const headers = {
      ...umsHeaders.USER_AGENT_JSON_PLAIN,
      Cookie: cookie,
    };

    // Fetch the HTML content of the leave slip page
    const { data: html } = await axios.get(url, { headers });
    const $ = cheerio.load(html);

    // Locate the table that contains leave slip data
    const selectedTable = $('table#ctl00_cphHeading_tblSlipData');
    if (!selectedTable.length) {
      return null;
    }

    const data: Record<string, any> = {};

    // Extract header row values: LPU name and profile image
    const headerRow = selectedTable.find('tr').first();
    const lpuName = headerRow.find('strong').first().text().trim() || null;
    const profileImageTag = headerRow.find('img#ctl00_cphHeading_Image1');
    const profileImage = profileImageTag.length ? profileImageTag.attr('src') : null;

    data.lovely = lpuName;
    data.profile_image = profileImage;

    // Extract leave type
    const leaveTypeSpan = headerRow.find('span#ctl00_cphHeading_lblLName');
    const leaveType = leaveTypeSpan.length ? leaveTypeSpan.text().trim() : null;
    data.leave_type = leaveType;

    // Extract barcode image source
    const barcodeImg = selectedTable.find('img#ctl00_cphHeading_imgBarcodefile');
    const barcode = barcodeImg.length ? barcodeImg.attr('src') : null;
    data.barcode = barcode;

    // Define the set of keys to extract from subsequent rows
    const validLabels = [
      "leave_id",
      "leave_code",
      "vid",
      "name",
      "date_of_apply",
      "date_of_leaving",
      "date_of_return",
      "checkout_time",
      "checkin_time",
      "contact_no",
      "hostel",
      "room_number",
    ];

    // Loop through all rows of the table to extract additional data
    selectedTable.find('tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        // Clean up the label text to be used as a key
        let label = $(cells[0])
          .text()
          .trim()
          .replace(/\./g, '')
          .toLowerCase()
          .replace(/ /g, '_');

        if (validLabels.includes(label)) {
          // Try to get the value from a <span> if available, else use the cell text
          let value = '';
          const valueSpan = $(cells[2]).find('span');
          if (valueSpan.length) {
            value = valueSpan.text().trim();
          } else {
            value = $(cells[2]).text().trim();
          }
          if (value) {
            data[label] = value;
          }
        }
      }
    });

    return data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};
