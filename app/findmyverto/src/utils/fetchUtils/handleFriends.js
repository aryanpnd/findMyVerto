import axios from "axios";
import { API_URL } from "../../../context/Auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MMKV } from "react-native-mmkv";
import formatTimetable from "../helperFunctions/timetableFormatter";
import { mmkvStorage } from "../../../context/MainApp";
import formatTimeAgo from "../helperFunctions/dateFormatter";

export async function sendFriendRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${API_URL}/friends/sendRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.status) {
                setSentFriendRequests(prevRequests => [...prevRequests, student]);
                Toast.show({ type: 'success', text1: 'Request Sent!' });
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
            setDisableBtn(false)
        })
}

export async function cancelSentRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${API_URL}/friends/cancelRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.status) {
                Toast.show({
                    type: 'success',
                    text1: result.data.message,
                });
                setSentFriendRequests(sentFriendRequests.filter((item) => item._id !== student._id));
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
            setDisableBtn(false)
        })
}

export async function acceptFriendRequest(auth, student, setfriends, friends, setfriendRequests, friendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${API_URL}/friends/addFriend`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.status) {
                Toast.show({
                    type: 'success',
                    text1: result.data.message,
                });
                setfriendRequests(friendRequests.filter((item) => item._id !== student._id));
                setfriends([...friends, student]);
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
            setDisableBtn(false)
        })
}

export async function rejectFriendRequest(auth, student, setfriendRequests, friendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${API_URL}/friends/removeRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.status) {
                Toast.show({
                    type: 'success',
                    text1: result.data.message,
                });
                setfriendRequests(friendRequests.filter((item) => item._id !== student._id));
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
            setDisableBtn(false)
        })
}

export async function getFriendRequests(auth, setfriendRequests, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/friends/getRequests`, { reg_no: auth.reg_no, password: auth.password })
        .then(async (result) => {
            if (result.data.status) {
                setfriendRequests(result.data.friendRequests);
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

export async function getSentFriendRequests(auth, setSentFriendRequests, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/friends/getSentRequests`, { reg_no: auth.reg_no, password: auth.password })
        .then(async (result) => {
            if (result.data.status) {
                setSentFriendRequests(result.data.sentFriendRequests);
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
