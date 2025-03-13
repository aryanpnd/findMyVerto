import axios from "axios";
import { auth } from "../../../context/Auth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { friendsStorage } from "../../storage/storage";

export async function getFriends(
    auth,
    setfriends,
    setLoading,
    setRefreshing,
    noRefreshing,
    setUpdatedFriends,
    noLoading,
    page = 1,
    limit = 20,
    setPagination
) {
    !noLoading && setLoading(true);
    !noRefreshing && setRefreshing(true);
    await axios
        .post(`${auth.server.url}/friends/getFriends`, {
            reg_no: auth.reg_no,
            password: auth.password,
            page,
            limit,
        })
        .then((result) => {
            if (result.data.success) {
                // Optionally, save the friends list locally
                friendsStorage.set("FRIENDS", JSON.stringify(result.data.friends));
                setfriends(result.data.friends);
                setUpdatedFriends(result.data.friends);
                // Update pagination if a callback is provided
                if (setPagination && result.data.totalPages) {
                    setPagination({
                        currentPage: result.data.currentPage,
                        totalPages: result.data.totalPages,
                    });
                }
            } else {
                Toast.show({
                    type: "error",
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                });
            }
        })
        .catch((err) => {
            Toast.show({
                type: "error",
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
            setRefreshing(false);
        });
}


/**
 * Fetch friends from the API.
 *
 * @param {Object} params - An object containing:
 *  - auth: the auth object (with server URL, reg_no, and password)
 *  - pageNumber: number for the page to fetch
 *  - append: boolean, whether to append the new friends to the current list
 *  - currentFriends: current list of friends (if appending)
 *  - setFriends: function to update friends state
 *  - setTotalFriends: function to update total friends count
 *  - setCurrentPage: function to update current page
 *  - setTotalPages: function to update total pages
 *  - setLoading: function to update loading state
 *  - setRefreshing: function to update refreshing state
 *  - setFilteredFriends: function to update filtered friends list
 */
export const fetchFriends = async ({
    auth,
    pageNumber,
    append = false,
    currentFriends = [],
    setFriends,
    setTotalFriends,
    setCurrentPage,
    setTotalPages,
    setLoading,
    setRefreshing,
    setFilteredFriends,
    refresh = false,
}) => {
    try {
        if (!append && refresh) {
            setRefreshing(true);
        }
        setLoading(true);
        const response = await axios.post(`${auth.server.url}/friends/getFriends`, {
            reg_no: auth.reg_no,
            password: auth.password,
            page: pageNumber,
            limit: 20,
        });
        if (response.data.success) {
            // Merge new friends with previous list if appending, otherwise replace.
            const newFriends = append
                ? [...currentFriends, ...response.data.friends]
                : response.data.friends;

            setFriends(newFriends);
            setTotalFriends(response.data.totalFriends);
            friendsStorage.set("FRIENDS-COUNT", response.data.totalFriends);
            setFilteredFriends(newFriends);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);

            // Save the full updated list to local storage.
            updateLocalStorage(newFriends);
        } else {
            console.log(response.data.message);
            Toast.show({
                type: "error",
                text1: response.data.message,
                text2: response.data.errorMessage,
            });
        }
    } catch (err) {
        console.error(err);
        Toast.show({
            type: "error",
            text1: err.message,
        });
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
};
export const updateLocalStorage = (fullFriendsList) => {
    try {
        friendsStorage.set("FRIENDS", JSON.stringify(fullFriendsList));
    } catch (error) {
        console.error("Error saving friends to local storage", error);
    }
};

export async function sendFriendRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${auth.server.url}/friends/sendRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
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
    await axios.post(`${auth.server.url}/friends/cancelRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
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

export async function acceptFriendRequest(auth, student, setfriends, friends, setfriendRequests, friendRequests,friendRequestsCount, setFriendRequestsCount, setLoading, setDisableBtn) {
    setLoading(true)
    setDisableBtn(true)
    await axios.post(`${auth.server.url}/friends/addFriend`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
        .then(async (result) => {
            if (result.data.success) {
                Toast.show({
                    type: 'success',
                    text1: result.data.message,
                });
                setfriendRequests(friendRequests.filter((item) => item._id !== student._id));
                setFriendRequestsCount(friendRequestsCount - 1);
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
    await axios.post(`${auth.server.url}/friends/removeRequest`, { reg_no: auth.reg_no, password: auth.password, studentId: student._id })
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

export async function getFriendRequests(auth, setfriendRequests, setLoading, page = 1, limit = 15, setTotalPages, setTotalRequests) {
    setLoading(true);
    await axios
        .post(`${auth.server.url}/friends/getRequests`, {
            reg_no: auth.reg_no,
            password: auth.password,
            page,
            limit
        })
        .then((result) => {
            if (result.data.success) {
                setfriendRequests(result.data.friendRequests);
                setTotalPages(result.data.totalPages);
                setTotalRequests(result.data.totalRequests);
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                });
            }
        })
        .catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        });
}

export async function getSentFriendRequests(auth, setSentFriendRequests, setLoading, page = 1, limit = 15, setTotalPages) {
    setLoading(true);
    await axios
        .post(`${auth.server.url}/friends/getSentRequests`, {
            reg_no: auth.reg_no,
            password: auth.password,
            page,
            limit
        })
        .then((result) => {
            if (result.data.success) {
                setSentFriendRequests(result.data.sentFriendRequests);
                setTotalPages(result.data.totalPages);
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                });
            }
        })
        .catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        });
}

export async function getFriendRequestsCount(auth, setFriendRequestsCount) {
    try {
        const response = await axios.post(`${auth.server.url}/friends/getRequests`, {
            reg_no: auth.reg_no,
            password: auth.password,
            count: true,
        });
        if (response.data.success) {
            setFriendRequestsCount(response.data.totalRequests);
        } else {
            Toast.show({
                type: 'error',
                text1: response.data.message,
                text2: response.data.errorMessage,
            });
        }
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: error.message,
        });
        console.log(error);
    } finally {
    }
}

export async function removeFriend(auth, student_id, setLoading) {
    let success = false;
    setLoading(true);
    console.log({ reg_no: auth.reg_no, password: auth.password, studentId: student_id });
    try {
        const result = await axios.post(`${auth.server.url}/friends/removeFriend`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: student_id,
        });

        if (result.data.success) {
            Toast.show({
                type: 'success',
                text1: result.data.message,
            });
            friendsStorage.delete(`${student_id}`);
            friendsStorage.delete(`${student_id}-timetable`);
            friendsStorage.delete(`${student_id}-attendance`);
            friendsStorage.delete(`${student_id}-marks`);
            friendsStorage.delete(`${student_id}-cgpa`);
            friendsStorage.delete(`${student_id}-assignments`);
            friendsStorage.delete(`${student_id}-drives`);
            success = true;
        } else {
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage,
            });
            success = false;
        }
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: err.message,
        });
        console.log(err);
        success = false;
    } finally {
        setLoading(false);
    }
    return success;
}
