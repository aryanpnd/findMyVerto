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

export default function FriendTimetable({ route }) {
    const { id} = route.params;
    const [timeTable, settimeTable] = useState({})
    const [loading, setLoading] = useState(false)
    const [lastSynced, setLastSynced] = useState("")

    function handleFetchTimetable(sync) {
        
    }

    useEffect(() => {
        handleFetchTimetable(false)
    }, [])

    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
            </View>
            <SyncData self={true} time={lastSynced} color={"white"} bg={colors.secondary} syncNow={()=>handleFetchTimetable(true)}/>
            {
                loading ?
                    <></>
                    :
                    <TimeTableScreen timeTable={timeTable} />
            }
        </>
    )
}