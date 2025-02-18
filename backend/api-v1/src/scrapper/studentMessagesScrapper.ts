import axios from "axios";
import { umsHeaders } from "../constants/headers";
import { umsUrls } from "../constants/umsUrls";

export const scrapeStudentMessages = async (cookie: string, pageIndex:number,subject:string,description:string) => {
    try {
        const url = umsUrls.STUDENT_MESSAGES;
        const headers = {
            ...umsHeaders.USER_AGENT_JSON,
            Cookie: cookie,
        };

        const response = await axios.post(url,
            { "pageIndex": pageIndex||1, "Subject": subject|| "", "Description":description|| "" }, { headers });

        if (!response.data.d) {
            return {
                success: false,
                data: {},
                message: "No message data found",
                errorMessage: "No message data found",
            };
        }

        const messages = response.data.d;

        return {
            data: messages,
            message: "Successfully fetched messages",
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