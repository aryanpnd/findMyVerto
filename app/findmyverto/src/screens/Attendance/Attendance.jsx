import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL, AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { Alert } from 'react-native'
import { AppContext } from '../../../context/MainApp'
import { fetchAttendance } from '../../utils/fetchUtils/attendanceFetch'

export default function Attendance({ navigation }) {
  const { auth, logout2 } = useContext(AuthContext)
  const { attendanceLoading, setAttendanceLoading } = useContext(AppContext)
  const [attendance, setattendance] = useState({})
  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSynced, setLastSynced] = useState("")

  const handleAttendanceFetch = async (sync) => {
    fetchAttendance(setAttendanceLoading, setRefreshing, setattendance, auth, setIsError, sync, setLastSynced)
  }

  return (
    <>
      <AttendanceScreen attendance={attendance} fetchAttendance={handleAttendanceFetch} lastSynced={lastSynced} loading={attendanceLoading} self={true}/>
    </>
  )
}
