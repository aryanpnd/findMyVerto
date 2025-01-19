import AsyncStorage from "@react-native-async-storage/async-storage";
import { scrapeStudentTimetable } from "../scrapper/studentTimetableScrapper";
import { umsLogin } from "../scrapper/umsLogin";

export const getStudentLogin = async ({ reg_no, password }) => {
    try {
        const user = { reg_no: reg_no, password: password }
        const studentInfo = await umsLogin(user);
        const cookie = await AsyncStorage.getItem('ASP.NET_SessionId');
        console.log(cookie);
        
        return studentInfo;
    } catch (error) {
        console.log(error.message);
        return error.message
    }
}