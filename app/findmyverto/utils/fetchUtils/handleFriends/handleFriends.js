import axios from "axios";
import { API_URL } from "../../../context/Auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { friendsStorage } from "../../storage/storage";

export async function getFriends(auth, setfriends, setLoading, setRefreshing, noRefreshing, setUpdatedFriends, noLoading) {
    !noLoading && setLoading(true)
    !noRefreshing && setRefreshing(true)
    await axios.post(`${API_URL}/friends/getFriends`, { reg_no: auth.reg_no, password: auth.password })
        .then(async (result) => {
            if (result.data.success) {
                // await AsyncStorage.setItem("FRIENDS", JSON.stringify(result.data.friends));
                friendsStorage.set("FRIENDS", JSON.stringify(result.data.friends));
                setfriends(result.data.friends);
                setUpdatedFriends(result.data.friends)
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
            setRefreshing(false)
        })
}

export async function sendFriendRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${API_URL}/friends/sendRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.success) {
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
            if (result.data.success) {
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
            if (result.data.success) {
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
            if (result.data.success) {
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
            if (result.data.success) {
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
            if (result.data.success) {
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

export async function removeFriend(auth, student_id, setLoading) {
    setLoading(true)
    // let status=false;
    console.log({ reg_no: auth.reg_no, password: auth.password, studentId: student_id });

    await axios.post(`${API_URL}/friends/removeFriend`, { reg_no: auth.reg_no, password: auth.password, studentId: student_id })
        .then(async (result) => {
            if (result.data.success) {
                Toast.show({
                    type: 'success',
                    text1: result.data.message,
                });
                // await AsyncStorage.removeItem(`${student_id}`);
                // await AsyncStorage.removeItem(`${student_id}-timetable`);
                friendsStorage.delete(`${student_id}`)
                friendsStorage.delete(`${student_id}-timetable`)
                friendsStorage.delete(`${student_id}-attendance`)
                friendsStorage.delete(`${student_id}-marks`)
                friendsStorage.delete(`${student_id}-cgpa`)
                // status=true
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
                // status=false
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
            // status=false
        })
        .finally(() => {
            setLoading(false);
        })
}
