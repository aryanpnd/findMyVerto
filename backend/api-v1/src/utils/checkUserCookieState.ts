import axios from "axios";
import { checkUserCookieStateReturnType } from "../types/scrapperTypes";
import { umsHeaders } from "../constants/headers";
import { umsUrls } from "../constants/umsUrls";

export const checkUserCookieState = async (cookie: string): Promise<checkUserCookieStateReturnType> => {
    const headers = {
        ...umsHeaders.USER_AGENT_JSON,
        Cookie: cookie,
    };

    try {
        const response = await axios.post(umsUrls.STUDENT_PHONE_NUMBER, {}, { headers: headers });
        console.log(response.data);

        if (response.data.d.length > 0) {
            return {
                success: true,
                data: response.data.d
            }
        } else {
            return {
                success: false,
                data: {}
            }
        }
    } catch (error) {
        console.error("Error checking user cookie state:", error);
        return {
            success: false,
            data: {}
        }
    }
}