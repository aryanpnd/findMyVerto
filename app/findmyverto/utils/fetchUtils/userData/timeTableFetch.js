import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import formatTimetable, { filterOutdatedMakeup, formatClassesToday } from "../../helperFunctions/timetableFormatter";
import { MakeupSyncTime, TimetableSyncTime } from "../../settings/SyncAndRetryLimits";
import { userStorage } from "../../storage/storage";

// Global flag to prevent concurrent timetable fetches.
let isTimetableFetching = false;

// Performs one attempt to fetch the timetable data.
async function attemptFetchTimetable({
  setTimetableLoading,
  setRefreshing,
  settimeTable,
  setClassesToday,
  setCourses,
  auth,
  todayOnly,
  setLastSynced,
  setLastUpdated,
}) {
  const result = await axios.post(`${auth.server.url}/student/timetable`, {
    password: auth.password,
    reg_no: auth.reg_no,
  });

  if (result.data.success) {
    // Save the fetched data locally.
    userStorage.set("TIMETABLE", JSON.stringify(result.data));
    // await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
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
    return result.data;
  } else {
    // Throw an error if the server indicates failure.
    throw new Error(`${result.data.message}: ${result.data.errorMessage}`);
  }
}

// Recursively retries fetching the timetable up to maxRetries.
async function retryFetchTimetable(params, retryCount = 0, maxRetries = 5) {
  try {
    return await attemptFetchTimetable(params);
  } catch (error) {
    if (retryCount < maxRetries) {
      // Wait 1 second before retrying.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return retryFetchTimetable(params, retryCount + 1, maxRetries);
    } else {
      // After max retries, throw the error to be caught by the outer catch.
      throw error;
    }
  }
}

// Main function that checks local storage and fetches new data if needed.
// If auto-sync is active and the local data is outdated, it uses the retry logic.
// It also avoids starting a new fetch if one is already in progress.
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
) {
  // If a fetch is already in progress, do not start another.
  // if (isTimetableFetching) {
  //   console.log("Timetable fetch already in progress.");
  //   return;
  // }
  // isTimetableFetching = true;

  try {
    if (!sync) setTimetableLoading(true);
    if (sync) setRefreshing(true);

    // Retrieve stored timetable data.
    // let userTimeTableRaw = await AsyncStorage.getItem("TIMETABLE");
    // sleep for half second
    await new Promise((resolve) => setTimeout(resolve, 500));
    let userTimeTableRaw = userStorage.getString("TIMETABLE");

    let userTimeTable = userTimeTableRaw ? JSON.parse(userTimeTableRaw) : null;

    const syncInterval = TimetableSyncTime();
    const autoSyncEnabled = syncInterval > 0;
    const isOutdated =
      userTimeTable &&
      autoSyncEnabled &&
      new Date().getTime() - new Date(userTimeTable.lastSynced).getTime() > syncInterval;

    // Decide whether to fetch new data:
    // 1. No stored timetable exists.
    // 2. Forced sync (sync === true).
    // 3. Auto-sync is enabled and stored data is outdated.
    if (!userTimeTable || sync || (autoSyncEnabled && isOutdated)) {
      // If auto-sync is off and there is stored data, do nothing.
      if (syncInterval === 0 && !sync && userTimeTable) {
        // Use stored timetable.
      } else {
        if (autoSyncEnabled && isOutdated) {
          // Update the UI with the stored timetable while fetching new data.
          setRefreshing(true);
          setTimetableLoading(false);
          if (userTimeTable) {
            const tt = formatTimetable(userTimeTable.data.time_table, userTimeTable.data.courses, todayOnly);
            const classesToday = formatClassesToday(tt, todayOnly);
            setClassesToday(classesToday);
            settimeTable(tt);
            setCourses(userTimeTable.data.courses);
            setLastSynced(userTimeTable.lastSynced);
            setLastUpdated(userTimeTable.data.last_updated);
          }
          Toast.show({
            type: 'info',
            text1: "Auto-Syncing Timetable",
          });
        }
        // If a fetch is already in progress, do not start another.
        // if (isTimetableFetching) {
        //   console.log("Timetable fetch already in progress.");
        //   return;
        // }
        // isTimetableFetching = true;
        
        // Attempt to fetch new data with retry logic.
        const resultData = await retryFetchTimetable({
          setTimetableLoading,
          setRefreshing,
          settimeTable,
          setClassesToday,
          setCourses,
          auth,
          todayOnly,
          setLastSynced,
          setLastUpdated,
        });
        userTimeTable = resultData;
      }
    }

    // Use either the freshly fetched data or the stored timetable.
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
    Toast.show({
      type: 'error',
      text1: "Error fetching timetable",
      text2: `${error.message}`,
    });
  } finally {
    isTimetableFetching = false;
  }
}

export const fetchMakeup = async (
  setMakeupLoading,
  setRefreshing,
  setMakeup,
  auth,
  setIsError,
  sync,
  setLastSynced
) => {
  try {
    // 1. Set loading states
    if (!sync) setMakeupLoading(true);
    if (sync) setRefreshing(true);

    // 2. Load stored makeup data
    const raw = userStorage.getString("MAKEUP");
    let stored = raw ? JSON.parse(raw) : null;

    // 3. Determine auto-sync settings
    const syncInterval = MakeupSyncTime();
    const autoSync = syncInterval > 0;
    const isOutdated =
      stored &&
      autoSync &&
      (Date.now() - new Date(stored.lastSynced).getTime() > syncInterval);

    // 4. Decide if we need to fetch fresh data
    if (!stored || sync || (autoSync && isOutdated)) {
      // If auto-sync off & we have data & not forced, skip fetch
      if (!(syncInterval === 0 && !sync && stored)) {
        // Show interim local data when auto-syncing
        if (autoSync && isOutdated && stored) {
          setRefreshing(true);
          setMakeupLoading(false);
          setMakeup(filterOutdatedMakeup(stored.data));
          setLastSynced(stored.lastSynced);
          Toast.show({ type: "info", text1: "Auto-Syncing Makeup Classes" });
        }

        // 5. Fetch from server
        const res = await axios.post(`${auth.server.url}/student/makeup`, {
          reg_no: auth.reg_no,
          password: auth.password,
        });

        if (res.data.success) {
          // 6a. Persist and update state
          userStorage.set("MAKEUP", JSON.stringify(res.data));
          const fresh = filterOutdatedMakeup(res.data.data);
          setMakeup(fresh);
          setLastSynced(res.data.lastSynced);
          Toast.show({
            type: "success",
            text1: "Makeup Classes Synced",
            text2: res.data.message,
          });
          setIsError(false);
          stored = res.data;
        } else {
          // 6b. Server‐side error
          Toast.show({
            type: "error",
            text1: res.data.message,
            text2: res.data.errorMessage,
          });
          setIsError(true);
        }
      }
    }

    // 7. Fall back to stored data if available
    if (stored) {
      setMakeup(filterOutdatedMakeup(stored.data));
      setLastSynced(stored.lastSynced);
      setIsError(false);
    }

    // 8. Clear loading indicators
    setMakeupLoading(false);
    setRefreshing(false);
  } catch (error) {
    // 9. Network or unexpected error
    console.error(error);
    const raw = userStorage.getString("MAKEUP");
    if (raw) {
      const stored = JSON.parse(raw);
      setMakeup(filterOutdatedMakeup(stored.data));
      setLastSynced(stored.lastSynced);
    } else {
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Error fetching makeup classes",
        text2: error.message,
      });
    }
    setMakeupLoading(false);
    setRefreshing(false);
  }
};
