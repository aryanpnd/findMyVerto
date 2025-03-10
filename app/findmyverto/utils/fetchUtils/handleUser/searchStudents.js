import axios from "axios";
import { auth } from "../../../context/Auth";

/**
 * Fetches students based on the given query and pagination parameters.
 *
 * @param {object} auth - The authentication object (must include reg_no and password).
 * @param {string} query - The search term.
 * @param {number} page - The page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<object>} - The API response data.
 */
export async function loadStudents(auth, query, page, limit) {
  if (query.length < 2) {
    return { success: false, message: "Search query must be greater than 2" };
  }
  try {
    const url = `${auth.server.url}/student/search?q=${query}&r=${auth.reg_no}&p=${auth.password}&page=${page}&limit=${limit}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    throw err;
  }
}
