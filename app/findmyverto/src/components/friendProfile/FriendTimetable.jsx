import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TimeTableScreen from "../../components/timeTable/TimeTableScreen";
import SyncData from "../../components/miscellaneous/SyncData";
import { colors } from "../../constants/colors";
import { AuthContext } from "../../../context/Auth";
import OverlayLoading from "../../components/miscellaneous/OverlayLoading";
import Toast from "react-native-toast-message";
import { getFriendTimetable } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import formatTimetable, { formatClassesToday } from "../../../utils/helperFunctions/timetableFormatter";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { friendsStorage } from "../../../utils/storage/storage";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import { TimetableSyncTime } from "../../../utils/settings/SyncAndRetryLimits"; // New import for sync interval

export default function FriendTimetable({ navigation, route }) {
  const { auth } = useContext(AuthContext);
  const { id, name } = route.params;
  const [timeTable, settimeTable] = useState({});
  const [classesToday, setClassesToday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState("");
  const [courses, setCourses] = useState([]);
  const [isError, setIsError] = useState(false);

  async function handleFetchTimetable(sync) {
    if (loading) return;
    await getFriendTimetable(
      auth,
      id,
      sync,
      settimeTable,
      setClassesToday,
      setCourses,
      setLastSynced,
      setLoading,
      setRefreshing,
      setIsError
    );
  }

  async function fetchDataLocally() {
    try {
      setLoading(true);
      const studentRaw = friendsStorage.getString(`${id}-timetable`);
      if (studentRaw) {
        const student = JSON.parse(studentRaw);
        const parsedTimetable = formatTimetable(student.data.time_table, student.data.courses);
        // Simulate a slight delay.
        await new Promise((resolve) => setTimeout(resolve, 500));
        settimeTable(parsedTimetable);
        const todayClasses = formatClassesToday(parsedTimetable, false);
        setClassesToday(todayClasses);
        setLastSynced(student.lastSynced);

        // Auto-sync logic: check if local data is outdated.
        const syncInterval = TimetableSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        const isOutdated =
          autoSyncEnabled &&
          new Date().getTime() - new Date(student.lastSynced).getTime() > syncInterval;
        if (isOutdated) {
          Toast.show({
            type: "info",
            text1: "Auto-Syncing Friend Timetable",
          });
          // Show refresh indicator without full loading.
          setLoading(false);
          setRefreshing(true);
          await handleFetchTimetable(true);
          setRefreshing(false);
        }
      } else {
        // If there's no cached data, perform a standard fetch.
        await handleFetchTimetable(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error.message}`,
      });
    }
  }

  useEffect(() => {
    fetchDataLocally();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${name}'s Timetable`,
    });
  }, [navigation, name]);

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
        <SyncData
          self={true}
          time={formatTimeAgo(lastSynced)}
          color={"white"}
          bg={colors.secondary}
          syncNow={() => handleFetchTimetable(true)}
          loader={true}
          loading={refreshing}
        />
      </View>
      {!isError && <OverlayLoading loading={loading} loadingText={"Syncing..."} />}

      {isError ? (
        <ErrorMessage
          handleFetchTimetable={handleFetchTimetable}
          timetableLoading={loading}
          buttonHeight={45}
          ErrorMessage={"timetable"}
        />
      ) : (
        <TimeTableScreen timeTable={timeTable} loading={loading} classesToday={classesToday} />
      )}
    </>
  );
}
