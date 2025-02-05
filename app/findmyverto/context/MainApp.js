import React, { createContext, useState } from 'react';
import * as Updates from 'expo-updates';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [timetableLoading, setTimetableLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [friendsRefreshing, setFriendsRefreshing] = useState(false)
  const [allowedFieldsToShow, setAllowedFieldsToShow] = useState([])

  const [courses, setCourses] = useState({})
  const [friendsAttendance, setFriendsAttendance] = useState({})
  const [friendsAttendanceDetails, setFriendsAttendanceDetails] = useState({})
  const [friendsAttendanceLastSynced, setFriendsAttendanceLastSynced] = useState({})

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updated, setUpdated] = useState(false)
  const checkForUpdates = async (setLoading, alert) => {
    try {
      setLoading(true)
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true)
        await Updates.fetchUpdateAsync();
        alert.show(
          'Update Available',
          'A new update has been downloaded. Would you like to restart the app to apply the update?',
          [
            {
              text: 'OK',
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
            }
          ]
        );
      } else {
        alert.show('No Updates', 'Your app is up to date.', [{ text: 'OK' }]);
      }
      setLoading(false)
    } catch (error) {
      Alert.alert('Update Error', 'An error occurred while checking for updates.', [{ text: 'OK' }]);
      console.error('Error checking for updates:', error);
      setLoading(false)
    }
  };

  return (
    <AppContext.Provider value={{
      timetableLoading, setTimetableLoading,
      attendanceLoading, setAttendanceLoading,
      friendsRefreshing, setFriendsRefreshing,
      allowedFieldsToShow, setAllowedFieldsToShow,

      courses, setCourses,
      friendsAttendance, setFriendsAttendance,
      friendsAttendanceDetails, setFriendsAttendanceDetails,
      friendsAttendanceLastSynced, setFriendsAttendanceLastSynced,

      checkForUpdates, updateAvailable, setUpdateAvailable, updated, setUpdated
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };