import axios from 'axios';
import Toast from 'react-native-toast-message';
import { userStorage } from '../../storage/storage';
import formatExams from '../../helperFunctions/examsFormatter';
import { ExamsSyncTime } from '../../settings/SyncAndRetryLimits';

export async function fetchExams(
    auth,
    sync,
    setExams,
    setTotalExams,
    setLastSynced,
    setExamsLoading,
    setExamsRefresh,
    setIsError,
) {
    try {
        // Set loading states based on whether sync is forced
        if (!sync) setExamsLoading(true);
        if (sync) setExamsRefresh(true);

        // Retrieve stored exams data
        let userExamsRaw = userStorage.getString("EXAMS");
        let userExams = userExamsRaw ? JSON.parse(userExamsRaw) : null;

        // Get the sync interval (in ms) for exams
        const syncInterval = ExamsSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        // Determine if stored exams data is outdated using its lastSynced timestamp.
        const isOutdated = userExams && autoSyncEnabled &&
            (new Date().getTime() - new Date(userExams.lastSynced).getTime() > syncInterval);

        // Decide whether to fetch new data:
        // - Always fetch if no stored data exists.
        // - Fetch if forced sync is true.
        // - If auto-sync is enabled and the data is outdated, fetch new data.
        // If auto-sync is off (syncInterval === 0) and data exists, do not fetch unless forced.
        if (!userExams || sync || (autoSyncEnabled && isOutdated)) {
            if (syncInterval === 0 && !sync && userExams) {
                // Auto-sync is off and data exists – use stored data.
            } else {
                if (autoSyncEnabled && isOutdated) {
                    setExamsRefresh(true);
                    setExamsLoading(false);

                    // set the data from the local while it's being fetched.
                    if (userExams) {
                        setExams(userExams.data);
                        setTotalExams(userExams.data.length);
                        setLastSynced(userExams.lastSynced);
                    }
                    Toast.show({
                        type: 'info',
                        text1: "Auto-Syncing Exams"
                    });
                }
                const result = await axios.post(`${auth.server.url}/student/exams`, {
                    password: auth.password,
                    reg_no: auth.reg_no
                });
                if (result.data.success) {
                    userStorage.set("EXAMS", JSON.stringify(result.data));
                    const parsedExams = formatExams(result.data.data.exams);
                    setExams(parsedExams);
                    setTotalExams(result.data.data.exams.length);
                    setLastSynced(result.data.lastSynced);
                    Toast.show({
                        type: 'success',
                        text1: "Exams Synced",
                        text2: "Your exams have been synced successfully",
                    });
                    setIsError(false);
                    // Update our stored exams variable to the newly fetched data.
                    userExams = result.data;
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

        // If we have stored data (either from before or just fetched), update state.
        if (userExams) {
            const parsedExams = formatExams(userExams.data.exams);
            setExams(parsedExams);
            setTotalExams(userExams.data.exams.length);
            setLastSynced(userExams.lastSynced);
            setIsError(false);
        }
        setExamsLoading(false);
        setExamsRefresh(false);
    } catch (error) {
        console.error(error);
        let userExamsRaw = userStorage.getString("EXAMS");
        if (userExamsRaw) {
            let userExams = JSON.parse(userExamsRaw);
            const parsedExams = formatExams(userExams.data.exams);
            setExams(parsedExams);
            setTotalExams(userExams.data.exams.length);
            setLastSynced(userExams.lastSynced);
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: "Error fetching Exams",
                text2: `${error.message}`,
            });
        }
        setExamsLoading(false);
        setExamsRefresh(false);
        Toast.show({
            type: 'error',
            text1: "Error fetching Exams",
            text2: `${error.message}`,
        });
    }
}
