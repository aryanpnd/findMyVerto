import axios from 'axios';
import { load } from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { umsUrls } from '../constants/umsUrls';
import { umsLoginReturn, User } from '../types/scrapperTypes';
import { umsHeaders } from '../constants/headers';

export async function placementLogin(user: User): Promise<umsLoginReturn> {
  const url = umsUrls.PLACEMENT_PORTAL_LOGIN_URL;
  const headers = umsHeaders.USER_AGENT_FORM_URL_ENCODED;

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, headers }));

  try {
    const getResponse = await client.get(url, { headers });
    const $ = load(getResponse.data);

    const viewState = $('#__VIEWSTATE').val() as string;
    const viewStateGenerator = $('#__VIEWSTATEGENERATOR').val() as string;
    const eventValidation = $('#__EVENTVALIDATION').val() as string;

    const payload = new URLSearchParams({
      "__VIEWSTATE": viewState,
      "__VIEWSTATEGENERATOR": viewStateGenerator,
      "__EVENTVALIDATION": eventValidation,
      "txtUserName": user.reg_no,
      "txtPassword": user.password,
      "Button1": "Login",
    });

    await client.post(url, payload.toString(), { headers });

    const cookies = jar.getCookiesSync(url);
    const sessionCookie = cookies.find(cookie => cookie.key === "ASP.NET_SessionId");

    if (!sessionCookie) {
      return {
        login: false,
        message: "Failed to login",
        cookie: "",
      };
    }

    return {
      login: true,
      message: "Login Successful",
      cookie: sessionCookie.cookieString(),
    };
  } catch (error: any) {
    return {
      login: false,
      message: error.message,
      cookie: "",
    };
  }
}
