import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable, { filterOutdatedMakeup, formatClassesToday } from "../../helperFunctions/timetableFormatter";
import { API_URL } from "../../../context/Auth";
import { TimetableSyncTime } from "../../settings/SyncAndRetryLimits";

export async function fetchTimetable(
    setTimetableLoading,
    setRefreshing,
    settimeTable,
    setClassesToday,
    setCourses,
    auth,
    setIsError,
    sync,
    todayOnly = false,
    setLastSynced,
    setLastUpdated,
    isRetry
) {
    try {
        // Use different loading indicators based on the sync flag.
        if (!sync) setTimetableLoading(true);
        if (sync) setRefreshing(true);

        // Retrieve stored timetable data from AsyncStorage.
        let userTimeTableRaw = await AsyncStorage.getItem("TIMETABLE");
        let userTimeTable = userTimeTableRaw ? JSON.parse(userTimeTableRaw) : null;

        // Get the sync interval (in ms) for timetable.
        // A value of 0 means "Off" (auto-sync disabled).
        const syncInterval = TimetableSyncTime();
        const autoSyncEnabled = syncInterval > 0;

        // Determine if the stored timetable is outdated (only if auto-sync is enabled).
        const isOutdated =
            userTimeTable &&
            autoSyncEnabled &&
            (new Date().getTime() - new Date(userTimeTable.lastSynced).getTime() > syncInterval);

        // Decide whether to fetch new timetable data:
        // 1. Always fetch if no stored timetable data exists.
        // 2. Force fetch if the sync flag is true.
        // 3. If auto-sync is enabled and the stored timetable is outdated, fetch new data.
        if (!userTimeTable || sync || (autoSyncEnabled && isOutdated)) {
            // If auto-sync is off (syncInterval === 0) and this is not a forced sync, then do not fetch.
            if (syncInterval === 0 && !sync && userTimeTable) {
                // Use stored timetable.
            } else {
                const result = await axios.post(`${API_URL}/student/timetable`, {
                    password: auth.password,
                    reg_no: auth.reg_no
                });
                if (result.data.success) {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    const tt = formatTimetable(result.data.data.time_table, result.data.data.courses, todayOnly);
                    settimeTable(tt);
                    setCourses(result.data.data.courses);
                    const classesToday = formatClassesToday(tt, todayOnly);
                    setClassesToday(classesToday);
                    setLastSynced(result.data.lastSynced);
                    setLastUpdated(result.data.data.last_updated);
                    Toast.show({
                        type: 'success',
                        text1: "Timetable Synced",
                        text2: "Your timetable has been synced successfully",
                    });
                    setIsError(false);
                    // After a successful fetch, update the local timetable reference.
                    userTimeTable = result.data;
                } else {
                    if (!isRetry) {
                        Toast.show({
                            type: 'error',
                            text1: `${result.data.message}`,
                            text2: `${result.data.errorMessage}`,
                        });
                    }
                    setIsError(true);
                }
            }
        }

        // If we didn't fetch new data, use the stored timetable.
        if (userTimeTable) {
            const tt = formatTimetable(userTimeTable.data.time_table, userTimeTable.data.courses, todayOnly);
            const classesToday = formatClassesToday(tt, todayOnly);
            setClassesToday(classesToday);
            settimeTable(tt);
            setCourses(userTimeTable.data.courses);
            setLastSynced(userTimeTable.lastSynced);
            setLastUpdated(userTimeTable.data.last_updated);
            setIsError(false);
        }

        setTimetableLoading(false);
        setRefreshing(false);
    } catch (error) {
        console.error(error);
        setTimetableLoading(false);
        setRefreshing(false);
        setIsError(true);
        if (!isRetry) {
            Toast.show({
                type: 'error',
                text1: "Error fetching timetable",
                text2: `${error.message}`
            });
        }
    }
}

export async function fetchMakeup(
    setMakeupLoading,
    setRefreshing,
    setMakeup,
    auth,
    setIsError,
    sync,
    setLastSynced
) {
    try {
        if (!sync) setMakeupLoading(true);
        if (sync) setRefreshing(true);

        let makeupRaw = await AsyncStorage.getItem("MAKEUP");
        let storedMakeup = makeupRaw ? JSON.parse(makeupRaw) : null;

        if (!storedMakeup || sync) {
            const result = await axios.post(`${API_URL}/student/makeup`, {
                password: auth.password,
                reg_no: auth.reg_no
            });

            if (result.data.success) {
                await AsyncStorage.setItem("MAKEUP", JSON.stringify(result.data));
                let makeupClasses = filterOutdatedMakeup(result.data.data);

                setMakeup(makeupClasses);
                setLastSynced(result.data.lastSynced);
                Toast.show({
                    type: 'success',
                    text1: "Makeup Classes Fetched",
                    text2: result.data.message,
                });
                setIsError(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                });
                setIsError(true);
            }
        } else {
            let makeupClasses = filterOutdatedMakeup(storedMakeup.data);

            setMakeup(makeupClasses);
            setLastSynced(storedMakeup.lastSynced);
            setIsError(false);
        }
        setMakeupLoading(false);
        setRefreshing(false);
    } catch (error) {
        console.error(error);
        setMakeupLoading(false);
        setRefreshing(false);
        setIsError(true);
        Toast.show({
            type: 'error',
            text1: "Error fetching makeup classes",
            text2: error.message,
        });
    }
}