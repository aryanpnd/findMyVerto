import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable from "../helperFunctions/timetableFormatter";
import { API_URL } from "../../../context/Auth";

export async function fetchTimetable(
    setTimetableLoading,
    setRefreshing,
    settimeTable,
    setClassesToday,
    auth,
    setIsError,
    sync,
    todayOnly=false,
    setLastSynced,
    setLastUpdated
) {
    try {
        setTimetableLoading(true)
        setRefreshing(true)
        let userTimeTableRaw = await AsyncStorage.getItem("TIMETABLE");
        let userTimeTable = userTimeTableRaw ? JSON.parse(userTimeTableRaw) : null;
        if (!userTimeTable || sync) {
            if (!userTimeTable || userTimeTable.status === false || sync) {
                const result = await axios.post(`${API_URL}/student/timetable`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.status) {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    const tt = formatTimetable(result.data.data.time_table, result.data.data.courses, todayOnly)
                    settimeTable(tt)
                    setClassesToday(tt.length)
                    setLastSynced(result.data.lastSynced)
                    setLastUpdated(result.data.data.last_updated)
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                }
            }

        } else {
            const tt = formatTimetable(userTimeTable.data.time_table, userTimeTable.data.courses, todayOnly)
            setClassesToday(tt.length)
            settimeTable(tt)
            setLastSynced(userTimeTable.lastSynced)
            setLastUpdated(userTimeTable.data.last_updated)
        }
        setTimetableLoading(false)
        setRefreshing(false)
        setIsError(false)
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