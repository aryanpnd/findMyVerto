import React, { createContext, useState } from 'react';
import * as Updates from 'expo-updates';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [timetableLoading, setTimetableLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceDetailsLoading, setAttendanceDetailsLoading] = useState(false)
  const [attendanceDetailsRefreshing, setAttendanceDetailsRefreshing] = useState(false)
  const [friendsRefreshing, setFriendsRefreshing] = useState(false)
  const [allowedFieldsToShow, setAllowedFieldsToShow] = useState([])
  const [friendRequests, setFriendRequests] = useState(0)

  const [courses, setCourses] = useState({})

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updated, setUpdated] = useState(false)

  const checkForUpdates = async (setLoading, alert) => {
    try {
      setLoading(true)
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        console.log("update available");
        
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
        console.log("update not available");

        alert.show('No Updates', 'Your app is up to date. 🎉', [{
          text: 'OK',
          onPress: () => console.log("cancelled")
        }]);
      }
      setLoading(false)
    } catch (error) {
      alert.show('Update Error', 'An error occurred while checking for updates.', [{ text: 'OK', onPress: () => { } }]);
      console.error('Error checking for updates:', error);
      setLoading(false)
    }
  };

  return (
    <AppContext.Provider value={{
      timetableLoading, setTimetableLoading,
      attendanceLoading, setAttendanceLoading,
      attendanceDetailsLoading, setAttendanceDetailsLoading,
      attendanceDetailsRefreshing, setAttendanceDetailsRefreshing,
      friendsRefreshing, setFriendsRefreshing,
      allowedFieldsToShow, setAllowedFieldsToShow,
      friendRequests, setFriendRequests,

      courses, setCourses,

      checkForUpdates, updateAvailable, setUpdateAvailable, updated, setUpdated
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };