import axios from 'axios';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers'
import { umsLogin } from './umsLogin';
import { umsLoginReturn, User } from '../types/scrapperTypes';

export const scrapeStudentBasicInfo = async (user: User) => {
    try {
        let studentInfoResponse;
        let headers;

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

        headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: login.cookie
        }

        studentInfoResponse = await axios.post(umsUrls.STUDENT_BASIC_INFO_URL, {}, {
            headers: headers
        });

        const studentInfoRaw = studentInfoResponse.data.d[0];

        const studentInfo = {
            reg_no: studentInfoRaw.Registrationnumber,
            program: studentInfoRaw.Program,
            section: studentInfoRaw.Section,
            studentName: studentInfoRaw.StudentName,
            studentPicture: studentInfoRaw.StudentPicture,
            dateofBirth: studentInfoRaw.DateofBirth,
            attendance: studentInfoRaw.AggAttendance,
            cgpa: studentInfoRaw.CGPA,
            rollNumber: studentInfoRaw.RollNumber,
            pendingFee: studentInfoRaw.PendingFee,
            encryptedDob: studentInfoRaw.EncryptedDob,
            studentUid: studentInfoRaw.StudentUid,
            stuUIDName: studentInfoRaw.StuUIDName
        }

        return {
            data: studentInfo,
            requestTime: new Date().toISOString(),
            message: "Data fetched successfully",
            status: true
        }
    } catch (error: any) {
        // console.error(error);
        return {
            data: {},
            requestTime: "",
            message: "Unable to fetch the data",
            status: false,
            errorMessage: error.message
        }
    }
};
