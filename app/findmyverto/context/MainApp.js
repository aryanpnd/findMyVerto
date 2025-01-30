import React, { createContext, useEffect, useState } from 'react';
// import { MMKV } from 'react-native-mmkv'

const AppContext = createContext();

// export const mmkvStorage = new MMKV()

const AppProvider = ({ children }) => {
    const [courses, setCourses] = useState({})
    const [timetableLoading, setTimetableLoading] = useState(false)
    const [attendanceLoading, setAttendanceLoading] = useState(false)    

    return (
        <AppContext.Provider value={{
            courses,setCourses,
            timetableLoading, setTimetableLoading,
            attendanceLoading, setAttendanceLoading
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };