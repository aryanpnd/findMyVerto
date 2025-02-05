import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable from "../helperFunctions/timetableFormatter";
import { API_URL } from "../../context/Auth";

export async function fetchBasicDetails(
    setProfileLoading,
    setRefreshing,
    setDetails,
    auth,
    setIsError,
    sync,
    setLastSynced,
) {
    try {
        setProfileLoading(true)
        setRefreshing(true)
        let userDetailsRaw = await AsyncStorage.getItem("STUDENT_BASIC_DETAILS");
        let userDetails = userDetailsRaw ? JSON.parse(userDetailsRaw) : null;
        if (!userDetails || sync) {
            if (!userDetails || userDetails.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/basicInfo`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    await AsyncStorage.setItem("STUDENT_BASIC_DETAILS", JSON.stringify(result.data));
                    setDetails(result.data)
                    setLastSynced(result.data.requestTime)
                    setIsError(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Details Synced',
                        text2: `Details synced successfully`,
                    });
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
            setDetails(userDetails)
            setLastSynced(userDetails.last_updated)
            setIsError(false)
        }
        setProfileLoading(false)
        setRefreshing(false)
    } catch (error) {
        console.error(error);
        setProfileLoading(false)
        setRefreshing(false)
        setIsError(true)
        Toast.show({
            type: 'error',
            text1: "Error fetching Details",
            text2: `${error.message}`
        });
    }
}