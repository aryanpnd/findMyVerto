import Toast from "react-native-toast-message";
import axios from "axios";
import { auth } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import { AttendanceSyncTime } from "../../settings/SyncAndRetryLimits";

let isAttendanceFetching = false;

export async function fetchAttendance(
  setAttendanceLoading,
  setRefreshing,
  setAttendance,
  setAttendanceDetails,
  auth,
  setIsError,
  sync, // boolean to force sync
  setLastSynced,
  isRetry
) {
  if (isAttendanceFetching) {
    // console.log("Attendance fetch already in progress. ⌛");
    return;
  }

  isAttendanceFetching = true;

  try {
    // console.log("Fetching Attendance 🏃‍♀️");
    setAttendanceLoading(true);
    setRefreshing(true);
    let userAttendanceRaw = userStorage.getString("ATTENDANCE");
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
      });
      if (result.data.success) {
        userStorage.set("ATTENDANCE", JSON.stringify(result.data));
        setAttendance(result.data.summary);
        setAttendanceDetails(result.data.details);
        setLastSynced(result.data.last_updated);
        Toast.show({
          type: 'success',
          text1: "Attendance Synced",
          text2: "Your attendance has been synced successfully",
        });
        setIsError(false);

        // console.log("Attendance fetch completed.✅ ");
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
    } else {
      setAttendance(userAttendance.summary);
      setAttendanceDetails(userAttendance.details);
      setLastSynced(userAttendance.last_updated);
      setIsError(false);
    }
    setAttendanceLoading(false);
    setRefreshing(false);
  } catch (error) {
    console.error(error);
    let userAttendanceRaw = userStorage.getString("ATTENDANCE");
    if (userAttendanceRaw) {
      let userAttendance = JSON.parse(userAttendanceRaw);
      setAttendance(userAttendance.summary);
      setAttendanceDetails(userAttendance.details);
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
  } finally {
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
    let userAttendanceRaw = userStorage.getString("ATTENDANCE");
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
    let userAttendanceRaw = userStorage.getString("ATTENDANCE");
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