import axios from "axios";
import { checkUserCookieStateReturnType } from "../types/scrapperTypes";

export const checkUserCookieState = async (cookie: string, headers: any, url: string, body: any): Promise<checkUserCookieStateReturnType> => {

    const response = await axios.post(url, body, {headers:headers});
    if (response.data.d[0].length > 0) {
        return {
            status: true,
            data: response.data.d[0]
        }
    } else {
        return {
            status: false,
            data: {}
        }
    }

}