import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppContext } from '../../../context/MainApp';
import { fetchTimetable } from '../../../utils/fetchUtils/userData/timeTableFetch';
import Toast from 'react-native-toast-message';
import SyncData from '../../components/miscellaneous/SyncData';
import { colors } from '../../constants/colors';
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter';
import OverlayLoading from '../../components/miscellaneous/OverlayLoading';
import { ErrorMessage } from '../../components/timeTable/ErrorMessage';
import { AuthContext } from '../../../context/Auth';
import CoursesCard from '../../components/timeTable/CoursesCard';
import CoursesScreen from '../../components/timeTable/CoursesScreen';

export default function Courses() {
    const { auth } = useContext(AuthContext)
    const { timetableLoading, setTimetableLoading } = useContext(AppContext)
    const [classesToday, setClassesToday] = useState(0)
    const [timeTable, settimeTable] = useState([])
    const [courses, setCourses] = useState([])

    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")
    const [lastUpdated, setLastUpdated] = useState("")

    const handleFetchCourses = async (sync) => {
        if (timetableLoading || refreshing) return
        await fetchTimetable(setTimetableLoading, setRefreshing, settimeTable, setClassesToday, setCourses, auth, setIsError, sync, false, setLastSynced, setLastUpdated)
    }

    useEffect(() => {
        handleFetchCourses(false)
    }, [])

    return (
        <CoursesScreen
            courses={courses}
            handleFetchCourses={handleFetchCourses}
            isError={isError}
            lastSynced={lastSynced}
            self={true}
            refreshing={refreshing}
            timetableLoading={timetableLoading}
        />
    );
}
