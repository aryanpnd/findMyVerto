import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import TimeTableScreen from '../../components/timeTable/TimeTableScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SyncData from '../../components/miscellaneous/SyncData'
import { colors } from '../../constants/colors'
import { AuthContext } from '../../../context/Auth'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import Toast from 'react-native-toast-message'
import { getFriendTimetable } from '../../../utils/fetchUtils/friendData/handleFriendsData'
import formatTimetable from '../../../utils/helperFunctions/timetableFormatter'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { friendsStorage } from '../../../utils/storage/storage'
import { ErrorMessage } from '../timeTable/ErrorMessage'

export default function FriendTimetable({ navigation, route }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [timeTable, settimeTable] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [lastSynced, setLastSynced] = useState("")
    const [courses, setCourses] = useState([])
    const [isError, setIsError] = useState(false)

    async function handleFetchTimetable(sync) {
        if (loading) return
        await getFriendTimetable(auth, id, sync, settimeTable, setCourses, setLastSynced, setLoading, setRefreshing, setIsError)
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            // const studentRaw = await AsyncStorage.getItem(`${id}-timetable`);
            const studentRaw = friendsStorage.getString(`${id}-timetable`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                const parsedTimetable = formatTimetable(student.data.time_table, student.data.courses)
                // sleep for half second
                await new Promise((resolve) => setTimeout(resolve, 500));
                settimeTable(parsedTimetable)
                setLastSynced(student.lastSynced)
            } else {
                await handleFetchTimetable(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${error.message}`
            });
        }
    }

    useEffect(() => {
        fetchDataLocally(false)
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${name}'s Timetable`
        });
    }, [navigation]);

    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData self={true} time={formatTimeAgo(lastSynced)} color={"white"} bg={colors.secondary} syncNow={() => handleFetchTimetable(true)} loader={true} loading={refreshing} />
            </View>
            {!isError && <OverlayLoading loading={loading} loadingText={"Syncing..."} />}

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={handleFetchTimetable} timetableLoading={loading} buttonHeight={45} ErrorMessage={"timetable"} />
                    :
                    <TimeTableScreen timeTable={timeTable} loading={loading} />
            }
        </>
    )
}