import Toast from "react-native-toast-message";
import axios from "axios";
import { auth } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import { AttendanceSyncTime } from "../../settings/SyncAndRetryLimits";

let isAttendanceFetching = false;

export async function fetchAttendanceDetails(
  setAttendanceLoading,
  setRefreshing,
  setAttendanceDetails,
  auth,
  setIsError,
  sync, // boolean to force sync
  setLastSynced,
  isRetry
) {
  let raw = userStorage.getString("ATTENDANCE-DETAILS");

  if (isAttendanceFetching) {
    let stored = raw ? JSON.parse(raw) : null;
    if (stored) {
      setAttendanceDetails(stored.details.attendance_details);
      setLastSynced(stored.last_updated);
    }
    return;
  };

  isAttendanceFetching = true;

  try {
    // Start loading or refreshing based on sync flag
    if (!sync) setAttendanceLoading(true);
    if (sync) setRefreshing(true);

    // Load stored data
    let stored = raw ? JSON.parse(raw) : null;

    const interval = AttendanceSyncTime();
    const autoSync = interval > 0;
    const outdated = stored && autoSync && (Date.now() - new Date(stored.last_updated).getTime() > interval);

    if (!stored || sync || outdated) {
      if (autoSync && outdated && stored) {
        // Show local while fetching
        setRefreshing(true);
        setAttendanceLoading(false);
        setAttendanceDetails(stored.details.attendance_details);
        setLastSynced(stored.last_updated);
        Toast.show({ type: 'info', text1: "Auto-Syncing Attendance" });
      }

      const result = await axios.post(`${auth.server.url}/student/attendance`, {
        password: auth.password,
        reg_no: auth.reg_no,
      });

      if (result.data.success) {
        userStorage.set("ATTENDANCE-DETAILS", JSON.stringify(result.data));
        setAttendanceDetails(result.data.details.attendance_details);
        setLastSynced(result.data.last_updated);
        Toast.show({ type: 'success', text1: "Attendance Synced", text2: "Your attendance has been synced successfully" });
        setIsError(false);
      } else {
        if (!isRetry) Toast.show({ type: 'error', text1: result.data.message, text2: result.data.errorMessage });
        setIsError(true);
      }
    } else {
      // Use stored
      setAttendanceDetails(stored.details.attendance_details);
      setLastSynced(stored.last_updated);
      setIsError(false);
    }
  } catch (error) {
    console.error(error);
    let raw = userStorage.getString("ATTENDANCE-DETAILS");
    if (raw) {
      let stored = JSON.parse(raw);
      setAttendanceDetails(stored.details.attendance_details);
      setLastSynced(stored.last_updated);
      setIsError(false);
      if (!isRetry) Toast.show({ type: 'error', text1: "Error fetching Attendance", text2: error.message });
    } else {
      setIsError(true);
      Toast.show({ type: 'error', text1: "Error fetching Attendance", text2: error.message });
    }
  } finally {
    setAttendanceLoading(false);
    setRefreshing(false);
    isAttendanceFetching = false;
  }
}


let isAttendanceSummaryFetching = false;
export async function fetchAttendanceSummary(
  setAttendanceLoading,
  setRefreshing,
  setAttendance,
  auth,
  setIsError,
  sync, // boolean to force sync
  setLastSynced,
  isRetry,
  setAttendanceSummarySuccess
) {
  if (isAttendanceSummaryFetching) {
    // console.log("Attendance summary fetch already in progress. ⏳");
    return;
  }

  isAttendanceSummaryFetching = true;

  try {
    // console.log("Fetching Attendance Summary 🏃‍♀️");
    setAttendanceLoading(true);
    setRefreshing(true);
    let userAttendanceRaw = userStorage.getString("ATTENDANCE-SUMMARY");
    let userAttendance = userAttendanceRaw ? JSON.parse(userAttendanceRaw) : null;

    const syncInterval = AttendanceSyncTime();
    // Auto-sync only if syncInterval > 0. If Off (0), only manual sync triggers a refresh.
    const autoSyncEnabled = syncInterval > 0;
    const isOutdated =
      userAttendance &&
      autoSyncEnabled &&
      new Date().getTime() - new Date(userAttendance.last_updated).getTime() > syncInterval;

    if (!userAttendance || sync || isOutdated) {
      const result = await axios.post(`${auth.server.url}/student/attendance`, {
        password: auth.password,
        reg_no: auth.reg_no,
        summary: true,
      });
      if (result.data.success) {
        userStorage.set("ATTENDANCE-SUMMARY", JSON.stringify(result.data));
        setAttendance(result.data.summary);
        setLastSynced(result.data.last_updated);
        // Toast.show({
        //   type: 'success',
        //   text1: "Attendance Synced",
        //   text2: "Your attendance has been synced successfully",
        // });
        setIsError(false);
        setAttendanceSummarySuccess(true);
        // console.log("Attendance summary fetch completed.✅ ");
      } else {
        if (!isRetry) {
          Toast.show({
            type: 'error',
            text1: `${result.data.message}`,
            text2: `${result.data.errorMessage}`,
          });
        }
        setIsError(true);
        setAttendanceSummarySuccess(false);
      }
    } else {
      setAttendance(userAttendance.summary);
      setLastSynced(userAttendance.last_updated);
      setIsError(false);
      setAttendanceSummarySuccess(true);
    }
    setAttendanceLoading(false);
    setRefreshing(false);
  } catch (error) {
    console.error("Attendance summary error catch block");
    let userAttendanceRaw = userStorage.getString("ATTENDANCE-SUMMARY");
    if (userAttendanceRaw) {
      let userAttendance = JSON.parse(userAttendanceRaw);
      setAttendance(userAttendance.summary);
      setLastSynced(userAttendance.last_updated);
      setIsError(false);
      if (!isRetry) {
        Toast.show({
          type: 'error',
          text1: "Error fetching Attendance",
          text2: `${error.message}`,
        });
      }
      setAttendanceLoading(false);
      setRefreshing(false);
      return;
    }
    setIsError(true);
    setAttendanceLoading(false);
    setRefreshing(false);
    Toast.show({
      type: 'error',
      text1: "Error fetching Attendance",
      text2: `${error.message}`,
    });
    setAttendanceSummarySuccess(false);
  }
  finally {
    isAttendanceSummaryFetching = false;
  }
}