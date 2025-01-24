import { View, Text, Alert } from 'react-native'
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
import { AppContext } from '../../../context/MainApp'
import { fetchTimetable } from '../../utils/fetchUtils/timeTableFetch'
import Test from '../../components/home/Test'

export default function TimeTable() {
  const { auth, logout2 } = useContext(AuthContext)
  const { timetableLoading, setTimetableLoading } = useContext(AppContext)
  const [classesToday, setClassesToday] = useState(0)
  const [timeTable, settimeTable] = useState([])
  const [day, setDay] = useState(0)

  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSynced, setLastSynced] = useState("")
  const [lastUpdated, setLastUpdated] = useState("")

  const handleFetchTimetable = async (sync) => {
    if (timetableLoading) return
    fetchTimetable(setTimetableLoading, setRefreshing, settimeTable, setClassesToday, auth, setIsError, sync, false, setLastSynced, setLastUpdated)
  }

  useEffect(() => {
    handleFetchTimetable(false)
  }, [])


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      <SyncData self={true} syncNow={() => handleFetchTimetable(true)} time={formatTimeAgo(lastSynced)} color={"white"} bg={colors.secondary} />
      </View>
      {self && <OverlayLoading loading={timetableLoading} loadingText={"Syncing..."}/>}
      {
        timeTable ?
        // <TimeTableScreen timeTable={Object.entries(timeTable)} />
        <TimeTableScreen timeTable={timeTable}/>
        :
        <></>
          // <></>
      }
    </>
  )
}