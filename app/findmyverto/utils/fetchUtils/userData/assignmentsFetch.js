import axios from "axios";
import Toast from "react-native-toast-message";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import { AssignmentsSyncTime } from "../../settings/SyncAndRetryLimits";

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
        // Set loading states based on whether sync is forced.
        if (!sync) setAssignmentsLoading(true);
        if (sync) setAssignmentsRefresh(true);

        // Retrieve stored assignments data.
        let userAssignmentsRaw = userStorage.getString("ASSIGNMENTS");
        let userAssignments = userAssignmentsRaw ? JSON.parse(userAssignmentsRaw) : null;

        // Get the assignments sync interval (in ms)
        const syncInterval = AssignmentsSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        // Determine if stored assignments are outdated using lastSynced.
        const isOutdated =
            userAssignments &&
            autoSyncEnabled &&
            (new Date().getTime() - new Date(userAssignments.lastSynced).getTime() > syncInterval);

        // Decide whether to fetch new data:
        // - Always fetch if no stored data exists.
        // - Force fetch if sync is true.
        // - If auto-sync is enabled and the stored data is outdated, fetch new data.
        // If auto-sync is off (syncInterval === 0) and data exists, do not fetch unless forced.
        if (!userAssignments || sync || (autoSyncEnabled && isOutdated)) {
            if (syncInterval === 0 && !sync && userAssignments) {
                // Auto-sync is off; use stored data.
            } else {
                const result = await axios.post(`${API_URL}/student/assignments`, { 
                    password: auth.password, 
                    reg_no: auth.reg_no 
                });
                if (result.data.success) {
                    userStorage.set("ASSIGNMENTS", JSON.stringify(result.data));
                    setAssignments(result.data.data);
                    const total = result.data.data.theory.length +
                                  result.data.data.practical.length +
                                  result.data.data.reading.length;
                    setTotalAssignments(total);
                    setLastSynced(result.data.lastSynced);
                    Toast.show({
                        type: 'success',
                        text1: "Assignments Synced",
                        text2: "Your assignments have been synced successfully",
                    });
                    setIsError(false);
                    // Update local reference to newly fetched data.
                    userAssignments = result.data;
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    setIsError(true);
                }
            }
        }

        // If we have stored (or freshly fetched) data, update the state.
        if (userAssignments) {
            setAssignments(userAssignments.data);
            const total = userAssignments.data.theory.length +
                          userAssignments.data.practical.length +
                          userAssignments.data.reading.length;
            setTotalAssignments(total);
            setLastSynced(userAssignments.lastSynced);
            setIsError(false);
        }
        setAssignmentsLoading(false);
        setAssignmentsRefresh(false);
    } catch (error) {
        console.error(error);
        let userAssignmentsRaw = userStorage.getString("ASSIGNMENTS");
        if (userAssignmentsRaw) {
            let userAssignments = JSON.parse(userAssignmentsRaw);
            setAssignments(userAssignments.data);
            const total = userAssignments.data.theory.length +
                          userAssignments.data.practical.length +
                          userAssignments.data.reading.length;
            setTotalAssignments(total);
            setLastSynced(userAssignments.lastSynced);
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: "Error fetching Assignments",
                text2: `${error.message}`,
            });
        }
        setAssignmentsLoading(false);
        setAssignmentsRefresh(false);
    }
};
