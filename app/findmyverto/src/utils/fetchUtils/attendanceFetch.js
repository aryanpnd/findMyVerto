import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable from "../helperFunctions/timetableFormatter";
import { API_URL } from "../../../context/Auth";

export async function fetchAttendance(
    setAttendanceLoading,
    setRefreshing,
    setAttendance,
    setAttendanceDetails,
    auth,
    setIsError,
    sync,
    setLastSynced,
) {
    try {
        setAttendanceLoading(true)
        setRefreshing(true)
        let userAttendanceRaw = await AsyncStorage.getItem("ATTENDANCE");
        let userAttendance = userAttendanceRaw ? JSON.parse(userAttendanceRaw) : null;
        if (!userAttendance || sync) {
            if (!userAttendance || userAttendance.status === false || sync) {
                const result = await axios.post(`${API_URL}/student/attendance`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.status) {
                    await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data));
                    setAttendance(result.data.summary)
                    setAttendanceDetails(result.data.details)
                    setLastSynced(result.data.last_updated)
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                }
            }

        } else {
            setAttendance(userAttendance.summary)
            setAttendanceDetails(userAttendance.details)
            setLastSynced(userAttendance.last_updated)
        }
        setAttendanceLoading(false)
        setRefreshing(false)
        setIsError(false)
    } catch (error) {
        console.error(error);
        setAttendanceLoading(false)
        setRefreshing(false)
        setIsError(true)
        Toast.show({
            type: 'error',
            text1: "Error fetching Attendance",
            text2: `${error.message}`
        });
    }
}