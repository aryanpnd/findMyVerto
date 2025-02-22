import axios from "axios";
import { API_URL } from "../../../context/Auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import formatTimetable from "../../helperFunctions/timetableFormatter";
import formatTimeAgo from "../../helperFunctions/dateFormatter";
import { friendsStorage } from "../../storage/storage";
import formatExams from "../../helperFunctions/examsFormatter";

export async function getFriendDetails(auth, friend_id, setStudent, setLoading, loader) {
    loader && setLoading(true)
    await axios.post(`${API_URL}/friends/getFriendInfo`, { reg_no: auth.reg_no, password: auth.password, studentId: friend_id })
        .then(async (result) => {
            if (result.data.success) {
                // await AsyncStorage.setItem(`${friend_id}`, JSON.stringify(result.data.data));
                friendsStorage.set(`${friend_id}`, JSON.stringify(result.data.data));
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

export async function getFriendTimetable(auth, friend_id, sync, settimeTable, setCourses, setLastSynced, setLoading, setRefreshing, setIsError) {
    !sync && setLoading(true)
    sync && setRefreshing(true)
    await axios.post(`${API_URL}/friends/timetable`, { reg_no: auth.reg_no, password: auth.password, studentId: friend_id, sync: sync })
        .then(async (result) => {
            if (result.data.success) {
                friendsStorage.set(`${friend_id}-timetable`, JSON.stringify(result.data));
                const parsedTimetable = formatTimetable(result.data.data.time_table, result.data.data.courses)
                settimeTable(parsedTimetable)
                setCourses(result.data.data.courses)
                setLastSynced(result.data.lastSynced)
                Toast.show({
                    type: 'success',
                    text1: 'Timetable Synced',
                    text2: 'Timetable synced successfully'
                })
                setIsError(false)
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
                setIsError(true)
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
            setIsError(true)
        })
        .finally(() => {
            setLoading(false);
            setRefreshing(false)
        })
}

export async function getFriendAttendance(auth, id, setAttendance, setAttendanceDetails, setLastSynced, setLoading, setIsError) {
    setLoading(true);
    try {
        const result = await axios.post(`${API_URL}/friends/attendance`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: id
        });

        if (result.data.success) {
            friendsStorage.set(`${id}-attendance`, JSON.stringify(result.data));
            setAttendance(result.data.summary);
            setAttendanceDetails(result.data.details);
            setLastSynced(formatTimeAgo(result.data.last_updated));
            setIsError(false);

            Toast.show({
                type: 'success',
                text1: 'Attendance Synced',
                text2: 'Attendance synced successfully'
            });
        } else {
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage,
            });
            setIsError(true);
        }
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: err.message
        });
        console.log(err);
        setIsError(true);
    } finally {
        setLoading(false);
    }
}

export async function getFriendExams(auth, id, sync, setExams, setTotalExams, setLastSynced, setLoading, setRefreshing, setIsError) {
    !sync && setLoading(true)
    sync && setRefreshing(true)
    try {
        const result = await axios.post(`${API_URL}/friends/exams`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: id
        });

        if (result.data.success) {
            friendsStorage.set(`${id}-exams`, JSON.stringify(result.data));
            const parsedExams = formatExams(result.data.data.exams);
            setExams(parsedExams);
            setTotalExams(result.data.data.exams.length);
            setLastSynced(formatTimeAgo(result.data.last_updated));
            setIsError(false);

            Toast.show({
                type: 'success',
                text1: 'Exams Synced',
                text2: 'Exams synced successfully'
            });
        } else {
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage,
            });
            setIsError(true);
        }
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: err.message
        });
        console.log(err);
        setIsError(true);
    } finally {
        setLoading(false);
        setRefreshing(false)
    }
}

export async function getFriendAssignments(auth, id, sync, setAssignments, setTotalAssignments, setLastSynced, setLoading, setRefreshing, setIsError) {
    !sync && setLoading(true)
    sync && setRefreshing(true)
    try {
        const result = await axios.post(`${API_URL}/friends/assignments`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: id
        });

        if (result.data.success) {
            friendsStorage.set(`${id}-assignments`, JSON.stringify(result.data));
            setAssignments(result.data.data);
            setTotalAssignments(result.data.data.theory.length+result.data.data.practical.length+result.data.data.reading.length);
            setLastSynced(result.data.last_updated)
            setIsError(false);

            Toast.show({
                type: 'success',
                text1: 'Assignments Synced',
                text2: 'Assignments synced successfully'
            });
        } else {
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage,
            });
            setIsError(true);
        }
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: err.message
        });
        console.log(err);
        setIsError(true);
    } finally {
        setLoading(false);
        setRefreshing(false)
    }
}