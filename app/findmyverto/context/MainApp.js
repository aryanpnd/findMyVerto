import React, { createContext, useEffect, useState } from 'react';
// import { MMKV } from 'react-native-mmkv'

const AppContext = createContext();

// export const mmkvStorage = new MMKV()

const AppProvider = ({ children }) => {
    const [timetableLoading, setTimetableLoading] = useState(false)
    const [attendanceLoading, setAttendanceLoading] = useState(false)  
    const [friendsRefreshing, setFriendsRefreshing] = useState(false)
    const [allowedFieldsToShow, setAllowedFieldsToShow] = useState([])
    
    const [courses, setCourses] = useState({})
    const [friendsAttendance, setFriendsAttendance] = useState({})
    const [friendsAttendanceDetails, setFriendsAttendanceDetails] = useState({})
    const [friendsAttendanceLastSynced, setFriendsAttendanceLastSynced] = useState({})

    return (
        <AppContext.Provider value={{
            timetableLoading, setTimetableLoading,
            attendanceLoading, setAttendanceLoading,
            friendsRefreshing, setFriendsRefreshing,
            allowedFieldsToShow, setAllowedFieldsToShow,
            
            courses,setCourses,
            friendsAttendance, setFriendsAttendance,
            friendsAttendanceDetails, setFriendsAttendanceDetails,
            friendsAttendanceLastSynced, setFriendsAttendanceLastSynced
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };