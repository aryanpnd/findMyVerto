import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import {  AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { Alert } from 'react-native'
import { AppContext } from '../../../context/MainApp'
import { fetchAttendance } from '../../../utils/fetchUtils/userData/attendanceFetch'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'

export default function Attendance({ navigation,route }) {
  const routeParams = route.params

  const { auth } = useContext(AuthContext)
  const { attendanceLoading, setAttendanceLoading } = useContext(AppContext)
  const [attendance, setattendance] = useState({})
  const [attendanceDetails, setAttendanceDetails] = useState({})
  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSyncedRaw, setLastSyncedRaw] = useState("")
  const [lastSynced, setLastSynced] = useState("")

  const handleAttendanceFetch = async (sync) => {
    if(attendanceLoading) return
    await fetchAttendance(setAttendanceLoading, setRefreshing, setattendance, setAttendanceDetails, auth, setIsError, sync, setLastSyncedRaw)
  }
  useEffect(() => {
    handleAttendanceFetch()
    console.log(auth.server)
  }, [])

  useEffect(() => {
    setLastSynced(formatTimeAgo(lastSyncedRaw))
  }, [lastSyncedRaw])

  return (
    <>
      <AttendanceScreen
        attendance={attendance}
        fetchAttendance={handleAttendanceFetch}
        lastSynced={lastSynced}
        loading={attendanceLoading}
        self={true}
        navigation={navigation}
        attendanceDetails={attendanceDetails}
        isError={isError} 
        routeParams={routeParams}
        />
    </>
  )
}
