import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cheerio from 'react-native-cheerio';
import { umsUrls } from '../constants/umsUrls';
import { umsHeaders } from '../constants/headers';


/**
 * Function to get UMS cookie
 * @param user - User object with registration number and password {reg_no, password}
 * @returns `umsLoginReturn` - Object with login status, message, and cookie
 */
export async function umsLogin(user) {
    const url = umsUrls.LOGIN_URL;
    const headers = { ...umsHeaders };

    // Create an Axios instance
    const client = axios.create({ headers });

    // Interceptor to handle cookies
    client.interceptors.response.use(
        async (response) => {
            // Attempt to access set-cookie
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
                // Extract ASP.NET_SessionId
                const aspCookie = setCookieHeader.find((cookie) =>
                    cookie.startsWith('ASP.NET_SessionId')
                );
                if (aspCookie) {

                    try {
                        await AsyncStorage.setItem('ASP.NET_SessionId', aspCookie);
                    } catch (storageError) {
                        console.error("Error storing cookie:", storageError);
                    }
                }
            } else {
                console.warn("Set-Cookie header is missing or inaccessible.");
            }

            return response;
        },
        (error) => {
            console.error("Error in response interceptor:", error);
            return Promise.reject(error);
        }
    );


    try {
        // Initial GET request to fetch view states
        let response = await client.get(url);
        let $ = cheerio.load(response.data);


        let __VIEWSTATE = $("#__VIEWSTATE").val();
        let __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val();
        let __EVENTVALIDATION = $("#__EVENTVALIDATION").val();

        const payloadWithRegNoOnly = new URLSearchParams({
            "__LASTFOCUS": "",
            "__EVENTTARGET": "txtU",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": __VIEWSTATE,
            "__VIEWSTATEGENERATOR": __VIEWSTATEGENERATOR,
            "__SCROLLPOSITIONX": "0",
            "__SCROLLPOSITIONY": "0",
            "__EVENTVALIDATION": __EVENTVALIDATION,
            "txtU": user.reg_no,
            "TxtpwdAutoId_8767": "",
            "DropDownList1": "1",
        });

        // POST request with registration number only
        response = await client.post(url, payloadWithRegNoOnly.toString());
        $ = cheerio.load(response.data);

        __VIEWSTATE = $("#__VIEWSTATE").val();
        __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val();
        __EVENTVALIDATION = $("#__EVENTVALIDATION").val();

        const payloadWithPassword = new URLSearchParams({
            "__LASTFOCUS": "",
            "__EVENTTARGET": "",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": __VIEWSTATE,
            "__VIEWSTATEGENERATOR": __VIEWSTATEGENERATOR,
            "__SCROLLPOSITIONX": "0",
            "__SCROLLPOSITIONY": "0",
            "__EVENTVALIDATION": __EVENTVALIDATION,
            "txtU": user.reg_no,
            "TxtpwdAutoId_8767": user.password,
            "ddlStartWith": "StudentDashboard.aspx",
            "iBtnLogins150203125": "Login",
        });

        // POST request with registration number and password
        response = await client.post(url, payloadWithPassword.toString());

        // Retrieve the stored cookie
        const aspCookie = await AsyncStorage.getItem('ASP.NET_SessionId');

        if (!aspCookie) {
            return {
                login: false,
                message: "Failed to login",
                cookie: ""
            };
        }

        // Find element with "fg-password" in response.data and get its text
        const fgPassword = cheerio.load(response.data)('.fg-password').text().replace(/\n/g, '');

        if (fgPassword.length < 1) {
            return {
                login: false,
                message: "Invalid Credentials",
                cookie: ""
            };
        }

        return {
            login: true,
            message: "Login Successful",
            cookie: aspCookie,
            passwordExpiry: fgPassword
        };
    } catch (error) {
        console.error(error);
        return {
            login: false,
            message: error.message,
            cookie: ""
        };
    }
}
