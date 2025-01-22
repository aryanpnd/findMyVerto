import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import TimeTableScreen from '../../components/timeTable/TimeTableScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import SyncData from '../../components/miscellaneous/SyncData'
import { colors } from '../../constants/colors'
import { API_URL, AuthContext } from '../../../context/Auth'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import Toast from 'react-native-toast-message'
import formatTimeAgo from '../../utils/helperFunctions/dateFormatter'

export default function FriendTimetable({ navigation, route }) {
    const { _id, } = route.params;
    const [timeTable, settimeTable] = useState({})
    const [loading, setLoading] = useState(false)
    const [lastSynced, setLastSynced] = useState("")


    async function fetchTimeTableData() {
        try {
            setLoading(true)
            let userTimeTable = await AsyncStorage.getItem(`${_id}`);
            if (!userTimeTable) {
                await axios.post(`${API_URL}/api/student/getFriendData`, { studentId: _id }).then(async (result) => {
                    await AsyncStorage.setItem(`${_id}`, JSON.stringify(result.data))
                    const tt = result.data
                    delete tt.timetable.__v;
                    delete tt.timetable._id;
                    delete tt.timetable.registrationNumber;
                    settimeTable(tt.timeTable)
                    setLoading(false)
                }).catch((err) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching Time table',
                        text2: `${err}`,
                    });
                    console.log({ "inside catch": err });
                    setLoading(false)
                })
                return
            }
            setLoading(false)
            const tt = JSON.parse(userTimeTable)
            delete tt.timetable.__v;
            delete tt.timetable._id;
            delete tt.timetable.registrationNumber;
            settimeTable(tt.timetable)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTimeTableData()
    }, [])
    useEffect(() => {
        setLastSynced(formatTimeAgo(timeTable.lastSync))
    }, [timeTable]);


    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
            </View>
            {lastSynced && <SyncData self={false} time={lastSynced} color={"white"} bg={colors.secondary} />}
            {
                loading ?
                    <></>
                    :
                    // <></>
                    // Object.entries(timeTable).length>1 && timeTable && 
                    <TimeTableScreen timeTable={Object.entries(timeTable)} />
            }
        </>
    )
}