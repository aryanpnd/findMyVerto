import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

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