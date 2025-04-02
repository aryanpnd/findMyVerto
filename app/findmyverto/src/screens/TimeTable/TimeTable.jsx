import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import TimeTableScreen from '../../components/timeTable/TimeTableScreen';
import SyncData from '../../components/miscellaneous/SyncData';
import { colors } from '../../constants/colors';
import { AuthContext } from '../../../context/Auth';
import OverlayLoading from '../../components/miscellaneous/OverlayLoading';
import Toast from 'react-native-toast-message';
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter';
import { AppContext } from '../../../context/MainApp';
import { fetchTimetable } from '../../../utils/fetchUtils/userData/timeTableFetch';
import { ErrorMessage } from '../../components/timeTable/ErrorMessage';

export default function TimeTable() {
  const { auth } = useContext(AuthContext);
  const { timetableLoading, setTimetableLoading } = useContext(AppContext);
  const [classesToday, setClassesToday] = useState(0);
  const [timeTable, settimeTable] = useState([]);
  const [courses, setCourses] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSynced, setLastSynced] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const handleFetchTimetable = async (sync) => {
    if (timetableLoading || refreshing) return;
    await fetchTimetable(
      setTimetableLoading,
      setRefreshing,
      settimeTable,
      setClassesToday,
      setCourses,
      auth,
      setIsError,
      sync,         // sync flag: true forces a refresh
      false,        // todayOnly: false to get full timetable
      setLastSynced,
      setLastUpdated
    );
  };

  useEffect(() => {
    handleFetchTimetable(false);
  }, []);

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
        <SyncData
          self={true}
          syncNow={() => handleFetchTimetable(true)}
          time={formatTimeAgo(lastSynced)}
          color={"white"}
          bg={colors.secondary}
          loader={true}
          loading={refreshing}
        />
      </View>
      {timetableLoading && !isError && (
        <OverlayLoading loading={timetableLoading} loadingText={"Syncing..."} />
      )}

      {isError ? (
        <ErrorMessage
          handleFetchTimetable={handleFetchTimetable}
          timetableLoading={timetableLoading}
          buttonHeight={45}
          ErrorMessage={"timetable"}
        />
      ) : (
        <TimeTableScreen timeTable={timeTable} classesToday={classesToday} courses={courses}/>
      )}
    </>
  );
}
