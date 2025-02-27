import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
export async function fetchAttendance(
    setAttendanceLoading,
    setRefreshing,
    setAttendance,
    setAttendanceDetails,
    auth,
    setIsError,
    sync,
    setLastSynced,
    isRetry
) {
    try {
        setAttendanceLoading(true)
        setRefreshing(true)
        // let userAttendanceRaw = await AsyncStorage.getItem("ATTENDANCE");
        let userAttendanceRaw = userStorage.getString("ATTENDANCE");
        let userAttendance = userAttendanceRaw ? JSON.parse(userAttendanceRaw) : null;
        const isHourOld = userAttendance && new Date().getTime() - new Date(userAttendance.last_updated).getTime() > 3600000;        
        if (!userAttendance || sync || isHourOld) {
            if (!userAttendance || userAttendance.success === false || sync || isHourOld) {
                const result = await axios.post(`${API_URL}/student/attendance`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    // await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data));
                    userStorage.set("ATTENDANCE", JSON.stringify(result.data));
                    setAttendance(result.data.summary)
                    setAttendanceDetails(result.data.details)
                    setLastSynced(result.data.last_updated)
                    Toast.show({
                        type: 'success',
                        text1: "Attendance Synced",
                        text2: "Your attendance has been synced successfully",
                    });
                    setIsError(false)
                } else {
                    !isRetry && Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    setIsError(true)
                }
            }

        } else {
            setAttendance(userAttendance.summary)
            setAttendanceDetails(userAttendance.details)
            setLastSynced(userAttendance.last_updated)
            setIsError(false)
        }
        setAttendanceLoading(false)
        setRefreshing(false)
    } catch (error) {
        console.error(error);
        // let userAttendanceRaw = await AsyncStorage.getItem("ATTENDANCE");
        let userAttendanceRaw = userStorage.getString("ATTENDANCE");
        if (userAttendanceRaw) {
            let userAttendance = JSON.parse(userAttendanceRaw);
            setAttendance(userAttendance.summary)
            setAttendanceDetails(userAttendance.details)
            setLastSynced(userAttendance.last_updated)
            setIsError(false)
            !isRetry && Toast.show({
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