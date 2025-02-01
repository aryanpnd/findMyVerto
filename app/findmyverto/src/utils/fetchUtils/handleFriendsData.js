import axios from "axios";
import { API_URL } from "../../../context/Auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import formatTimetable from "../helperFunctions/timetableFormatter";
import formatTimeAgo from "../helperFunctions/dateFormatter";

export async function getFriendDetails(auth, friend_id, setStudent, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/friends/getFriendInfo`, { reg_no: auth.reg_no, password: auth.password, studentId: friend_id })
        .then(async (result) => {
            if (result.data.success) {
                await AsyncStorage.setItem(friend_id, JSON.stringify(result.data.data));
                setStudent(result.data.data)
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        })
}

export async function getFriendTimetable(auth, friend_id, sync, settimeTable,setLastSynced, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/friends/timetable`, { reg_no: auth.reg_no, password: auth.password, studentId: friend_id, sync: sync })
        .then(async (result) => {
            if (result.data.success) {
                await AsyncStorage.setItem(`${friend_id}-timetable`, JSON.stringify(result.data));
                const parsedTimetable = formatTimetable(result.data.data.time_table,result.data.data.courses)
                settimeTable(parsedTimetable)
                setLastSynced(formatTimeAgo(result.data.lastSynced))
                Toast.show({
                    type: 'success',
                    text1: 'Timetable Synced',
                    text2: 'Timetable synced successfully'
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        })
}