import axios from "axios";
import Toast from "react-native-toast-message";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";

export const fetchAssignments = async (
    auth,
    sync,
    setAssignments,
    setTotalAssignments,
    setAssignmentsLoading,
    setAssignmentsRefresh,
    setLastSynced,
    setIsError,
) => {
    try {
        !sync && setAssignmentsLoading(true);
        sync && setAssignmentsRefresh(true);
        let userAssignmentsRaw = userStorage.getString("ASSIGNMENTS");
        let userAssignments = userAssignmentsRaw ? JSON.parse(userAssignmentsRaw) : null;

        if (!userAssignments || sync) {
            if (!userAssignments || userAssignments.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/assignments`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    userStorage.set("ASSIGNMENTS", JSON.stringify(result.data));
                    setAssignments(result.data.data);
                    setTotalAssignments(result.data.data.theory.length+result.data.data.practical.length+result.data.data.reading.length);
                    setLastSynced(result.data.lastSynced);
                    Toast.show({
                        type: 'success',
                        text1: "Assignments Synced",
                        text2: "Your assignments have been synced successfully",
                    });
                    setIsError(false);
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    setIsError(true);
                }
            }
        } else {
            setAssignments(userAssignments.data);
            setTotalAssignments(userAssignments.data.theory.length+userAssignments.data.practical.length+userAssignments.data.reading.length);
            setLastSynced(userAssignments.lastSynced);
        }
        setAssignmentsLoading(false);
        setAssignmentsRefresh(false);
    }
    catch (error) {
        console.error(error);
        let userAssignmentsRaw = userStorage.getString("ASSIGNMENTS");
        if (userAssignmentsRaw) {
            let userAssignments = JSON.parse(userAssignmentsRaw);
            setAssignments(userAssignments.data);
            setTotalAssignments(userAssignments.data.theory.length+userAssignments.data.practical.length+userAssignments.data.reading.length);
            setLastSynced(userAssignments.lastSynced);
        }else{
            setIsError(true);
        }
        setAssignmentsLoading(false);
        setAssignmentsRefresh(false);
    }
}