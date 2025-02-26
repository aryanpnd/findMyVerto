import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable, { formatClassesToday } from "../../helperFunctions/timetableFormatter";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";

export async function fetchTimetable(
    setTimetableLoading,
    setRefreshing,
    settimeTable,
    setClassesToday,
    setCourses,
    auth,
    setIsError,
    sync,
    todayOnly = false,
    setLastSynced,
    setLastUpdated
) {
    try {
        !sync && setTimetableLoading(true)
        sync && setRefreshing(true)
        let userTimeTableRaw = await AsyncStorage.getItem("TIMETABLE");
        // let userTimeTableRaw = userStorage.getString("TIMETABLE");
        let userTimeTable = userTimeTableRaw ? JSON.parse(userTimeTableRaw) : null;

        if (!userTimeTable || sync) {
            if (!userTimeTable || userTimeTable.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/timetable`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    // userStorage.set("TIMETABLE", JSON.stringify(result.data));
                    const tt = formatTimetable(result.data.data.time_table, result.data.data.courses, todayOnly)
                    settimeTable(tt)
                    setCourses(result.data.data.courses)
                    const classesToday = formatClassesToday(tt, todayOnly);
                    setClassesToday(classesToday);
                    setLastSynced(result.data.lastSynced)
                    setLastUpdated(result.data.data.last_updated)
                    Toast.show({
                        type: 'success',
                        text1: "Timetable Synced",
                        text2: "Your timetable has been synced successfully",
                    });
                    setIsError(false)
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    setIsError(true)
                }
            }

        } else {
            const tt = formatTimetable(userTimeTable.data.time_table, userTimeTable.data.courses, todayOnly)
            const classesToday = formatClassesToday(tt, todayOnly);
            setClassesToday(classesToday);
            settimeTable(tt)
            setCourses(userTimeTable.data.courses)
            setLastSynced(userTimeTable.lastSynced)
            setLastUpdated(userTimeTable.data.last_updated)
            setIsError(false)
        }
        setTimetableLoading(false)
        setRefreshing(false)
    } catch (error) {
        console.error(error);
        setTimetableLoading(false)
        setRefreshing(false)
        setIsError(true)
        Toast.show({
            type: 'error',
            text1: "Error fetching timetable",
            text2: `${error.message}`
        });
    }
}