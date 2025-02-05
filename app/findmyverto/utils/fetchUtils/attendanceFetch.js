import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../context/Auth";
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
            if (!userAttendance || userAttendance.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/attendance`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data));
                    setAttendance(result.data.summary)
                    setAttendanceDetails(result.data.details)
                    setLastSynced(result.data.last_updated)
                    Toast.show({
                        type: 'success',
                        text1: "Attendance Synced",
                        text2: "Your attendance has been synced successfully",
                    });
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
        let userAttendanceRaw = await AsyncStorage.getItem("ATTENDANCE");
        if (userAttendanceRaw) {
            let userAttendance = JSON.parse(userAttendanceRaw);
            setAttendance(userAttendance.summary)
            setAttendanceDetails(userAttendance.details)
            setLastSynced(userAttendance.last_updated)
            setIsError(false)
            Toast.show({
                type: 'error',
                text1: "Error fetching Attendance",
                text2: `${error.message}`
            });
            setAttendanceLoading(false)
            setRefreshing(false)
            return
        }
        setIsError(true)
        setAttendanceLoading(false)
        setRefreshing(false)
        Toast.show({
            type: 'error',
            text1: "Error fetching Attendance",
            text2: `${error.message}`
        });
    }
}