import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable from "../../helperFunctions/timetableFormatter";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import { getFcmToken } from "../../notifications/pushNotificationService";

export async function fetchBasicDetails(
    setProfileLoading,
    setRefreshing,
    setDetails,
    auth,
    setIsError,
    sync,
    setLastSynced,
    isRetry
) {
    try {
        setProfileLoading(true)
        setRefreshing(true)
        // let userDetailsRaw = await AsyncStorage.getItem("STUDENT_BASIC_DETAILS");
        const fcmToken = await getFcmToken();
        let userDetailsRaw = userStorage.getString("STUDENT_BASIC_DETAILS");
        let userDetails = userDetailsRaw ? JSON.parse(userDetailsRaw) : null;
        if (!userDetails || sync) {
            if (!userDetails || userDetails.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/basicInfo`, { 
                    reg_no: auth.reg_no ,
                    password: auth.password,
                    devicePushToken: fcmToken 
                });
                if (result.data.success) {
                    // await AsyncStorage.setItem("STUDENT_BASIC_DETAILS", JSON.stringify(result.data));
                    userStorage.set("STUDENT_BASIC_DETAILS", JSON.stringify(result.data));
                    setDetails(result.data)
                    setLastSynced(result.data.requestTime)
                    setIsError(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Details Synced',
                        text2: `Details synced successfully`,
                    });
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
        !isRetry && Toast.show({
            type: 'error',
            text1: "Error fetching Details",
            text2: `${error.message}`
        });
    }
}