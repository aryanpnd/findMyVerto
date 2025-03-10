import axios from "axios";
import { auth } from "../../../context/Auth";
import formatTimeAgo from "../../helperFunctions/dateFormatter";
import Toast from "react-native-toast-message";
import { friendsStorage } from "../../storage/storage";

export const fetchFriendMarks = async (auth,studentId, setMarks, setLastSynced, setLoading, setRefresh, setIsError) => {
    setLoading(true);
    try {
        const result = await axios.post(`${auth.server.url}/friends/marks`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: studentId
        });

        if (result.data.success) {
            friendsStorage.set(`${studentId}-marks`, JSON.stringify(result.data));
            setMarks(result.data.data);
            setLastSynced(result.data.lastSynced);
            setIsError(false);
            Toast.show({
                type: 'success',
                text1: 'Marks Synced',
                text2: 'Marks synced successfully'
            });
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage
            });
        }
    } catch (err) {
        setIsError(true);
        Toast.show({
            type: 'error',
            text1: err.message
        });
    } finally {
        setLoading(false);
        setRefresh(false);
    }
}

export const fetchFriendCGPA = async (auth,studentId, setCGPA, setLastSynced, setLoading, setRefresh, setIsError) => {
    setLoading(true);
    try {
        const result = await axios.post(`${auth.server.url}/friends/cgpa`, {
            reg_no: auth.reg_no,
            password: auth.password,
            studentId: studentId
        });

        if (result.data.success) {
            friendsStorage.set(`${studentId}-cgpa`, JSON.stringify(result.data));
            setCGPA(result.data.data.cgpa);
            setLastSynced(result.data.lastSynced);
            setIsError(false);
            Toast.show({
                type: 'success',
                text1: 'CGPA Synced',
                text2: 'CGPA synced successfully'
            });
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: result.data.message,
                text2: result.data.errorMessage
            });
        }
    } catch (err) {
        setIsError(true);
        Toast.show({
            type: 'error',
            text1: err.message
        });
    } finally {
        setLoading(false);
        setRefresh(false);
    }
}