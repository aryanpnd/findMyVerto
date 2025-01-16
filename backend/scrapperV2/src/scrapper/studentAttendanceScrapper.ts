import axios from 'axios';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers'
import { umsLogin } from '../services/umsLogin';
import { umsLoginReturn } from '../types/servicesReturnTypes';
import { User } from '../types/userTypes'

export const scrapeStudentAttendance = async (user: User) => {
    try {
        let studentAttendanceResponse;
        let headers;

        const login: umsLoginReturn = await umsLogin({ reg_no: user.reg_no, password: user.password });
        if (!login.login) {
            throw new Error('Failed to login: ' + login.message);
        }

        headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: login.cookie
        }

        studentAttendanceResponse = await axios.post(umsUrls.STUDENT_BASIC_INFO_URL, {}, {
            headers: headers
        });

        return {
            data: studentAttendanceResponse.data.d[0],
            requestTime: new Date().toISOString(),
            message: "Data fetched successfully",
            status: false
        }
    } catch (error: any) {
        console.error(error);
        return {
            data: {},
            requestTime: "",
            message: "Unable to fetch the data",
            status: false,
            errorMessage: error.message
        }
    }
};
