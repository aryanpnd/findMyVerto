import Toast from "react-native-toast-message";
import axios from "axios";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";

export async function fetchMarks(
    auth,
    sync,
    setMarks,
    setLastSynced,
    setMarksLoading,
    setMarkRefresh,
    setIsError,
) {
    try {
        !sync && setMarksLoading(true)
        sync && setMarkRefresh(true)
        let userMarksRaw = userStorage.getString("MARKS");
        let userMarks = userMarksRaw ? JSON.parse(userMarksRaw) : null;
        
        if (!userMarks || sync) {
            if (!userMarks || userMarks.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/marks`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {                   
                    userStorage.set("MARKS", JSON.stringify(result.data));
                    setMarks(result.data.data)
                    setLastSynced(result.data.lastSynced)
                    Toast.show({
                        type: 'success',
                        text1: "Marks Synced",
                        text2: "Your marks have been synced successfully",
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
            setMarks(userMarks.data)
            setLastSynced(userMarks.lastSynced)
        }
        setMarksLoading(false)
        setMarkRefresh(false)
        setIsError(false)
    } catch (error) {
        console.error(error);
        let userMarksRaw = userStorage.getString("MARKS");
        if (userMarksRaw) {
            let userMarks = JSON.parse(userMarksRaw);
            setMarks(userMarks.data)
            setLastSynced(userMarks.lastSynced)
        }
        setMarksLoading(false)
        setMarkRefresh(false)
        setIsError(true)
    }
}

export async function fetchCgpa(
    auth,
    sync,
    setCgpa,
    setLastSynced,
    setCgpaLoading,
    setCgpaRefresh,
    setIsError,
) {
    try {
        !sync && setCgpaLoading(true)
        sync && setCgpaRefresh(true)
        let userCgpaRaw = userStorage.getString("CGPA");
        let userCgpa = userCgpaRaw ? JSON.parse(userCgpaRaw) : null;
        if (!userCgpa || sync) {
            if (!userCgpa || userCgpa.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/cgpa`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    userStorage.set("CGPA", JSON.stringify(result.data));
                    setCgpa(result.data.data.cgpa)
                    setLastSynced(result.data.lastSynced)
                    Toast.show({
                        type: 'success',
                        text1: "CGPA Synced",
                        text2: "Your cgpa has been synced successfully",
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
            setCgpa(userCgpa.data.cgpa)
            setLastSynced(userCgpa.lastSynced)
        }
        setCgpaLoading(false)
        setCgpaRefresh(false)
        setIsError(false)
    } catch (error) {
        console.error(error);
        let userCgpaRaw = userStorage.getString("CGPA");
        if (userCgpaRaw) {
            let userCgpa = JSON.parse(userCgpaRaw);
            setCgpa(userCgpa.data)
            setLastSynced(userCgpa.lastSynced)
        }
        setCgpaLoading(false)
        setCgpaRefresh(false)
        setIsError(true)
    }
}