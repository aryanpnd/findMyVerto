// studentdetailsscrapper.ts
import axios from 'axios';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';
import { umsLogin } from './umsLogin';
import { umsLoginReturn, User } from '../types/scrapperTypes';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';
import { saveImageLocally } from '../utils/saveImageLocally';
import { uploadImageToImageKit } from '../utils/uploadImageToImagekit';

export const scrapeStudentBasicInfo = async (user: User) => {
    try {
        let studentInfoResponse;
        let headers;

        const login: umsLoginReturn = await umsLogin({ reg_no: user.reg_no, password: user.password });
        if (!login.login) {
            return {
                data: {},
                lastSynced: "",
                message: "Failed to login",
                success: false,
                errorMessage: login.message
            };
        }

        headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: login.cookie
        };

        studentInfoResponse = await axios.post(umsUrls.STUDENT_BASIC_INFO_URL, {}, {
            headers: headers
        });

        const studentInfoRaw = studentInfoResponse.data.d[0];

        // Save student picture to cloudinary and get the URL also save it locally
        let studentPictureUrl = '';
        if (studentInfoRaw.StudentPicture) {
            saveImageLocally(studentInfoRaw.StudentPicture, studentInfoRaw.Registrationnumber);
            // studentPictureUrl = await uploadImageToCloudinary(studentInfoRaw.StudentPicture, studentInfoRaw.Registrationnumber);
            studentPictureUrl = await uploadImageToImageKit(studentInfoRaw.StudentPicture, studentInfoRaw.Registrationnumber);

        }

        const studentInfo = {
            reg_no: studentInfoRaw.Registrationnumber,
            program: studentInfoRaw.Program,
            section: studentInfoRaw.Section,
            studentName: studentInfoRaw.StudentName,
            studentPicture: studentPictureUrl,
            dateofBirth: studentInfoRaw.DateofBirth,
            attendance: studentInfoRaw.AggAttendance,
            cgpa: studentInfoRaw.CGPA,
            rollNumber: studentInfoRaw.RollNumber,
            pendingFee: studentInfoRaw.PendingFee,
            encryptedDob: studentInfoRaw.EncryptedDob,
            studentUid: studentInfoRaw.StudentUid,
            stuUIDName: studentInfoRaw.StuUIDName
        };

        return {
            data: studentInfo,
            lastSynced: new Date().toISOString(),
            message: "Data fetched successfully",
            success: true
        };
    } catch (error: any) {
        return {
            data: {},
            lastSynced: "",
            message: "Unable to fetch the data",
            success: false,
            errorMessage: error.message
        };
    }
};
