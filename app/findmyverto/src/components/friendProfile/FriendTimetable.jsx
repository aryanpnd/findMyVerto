import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import TimeTableScreen from '../../components/timeTable/TimeTableScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SyncData from '../../components/miscellaneous/SyncData'
import { colors } from '../../constants/colors'
import { AuthContext } from '../../../context/Auth'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import Toast from 'react-native-toast-message'
import { getFriendTimetable } from '../../../utils/fetchUtils/handleFriendsData'
import formatTimetable from '../../../utils/helperFunctions/timetableFormatter'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { friendsStorage } from '../../../utils/storage/storage'

export default function FriendTimetable({ navigation, route }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [timeTable, settimeTable] = useState({})
    const [loading, setLoading] = useState(false)
    const [lastSynced, setLastSynced] = useState("")

    async function handleFetchTimetable(sync) {
        await getFriendTimetable(auth, id, sync, settimeTable, setLastSynced, setLoading)
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            // const studentRaw = await AsyncStorage.getItem(`${id}-timetable`);
            const studentRaw = friendsStorage.getString(`${id}-timetable`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                const parsedTimetable = formatTimetable(student.data.time_table, student.data.courses)
                settimeTable(parsedTimetable)
                setLastSynced(formatTimeAgo(student.lastSynced))
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
                <SyncData self={true} time={lastSynced} color={"white"} bg={colors.secondary} syncNow={() => handleFetchTimetable(true)} loader={true} loading={loading} />
            </View>
                <OverlayLoading loading={loading} loadingText={"Syncing..."} />

            <TimeTableScreen timeTable={timeTable} loading={loading} />
        </>
    )
}