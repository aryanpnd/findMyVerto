import { useContext, useEffect, useState } from 'react'
import {  AuthContext } from '../../../context/Auth'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { AppContext } from '../../../context/MainApp'
import {  fetchAttendanceSummary } from '../../../utils/fetchUtils/userData/attendanceFetch'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'

export default function Attendance({ navigation,route }) {
  const routeParams = route.params

  const { auth } = useContext(AuthContext)
  const { attendanceLoading, setAttendanceLoading } = useContext(AppContext)
  const [attendance, setattendance] = useState({})
  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSyncedRaw, setLastSyncedRaw] = useState("")
  const [lastSynced, setLastSynced] = useState("")

  const handleAttendanceFetch = async (sync) => {
    if(attendanceLoading) return

    await fetchAttendanceSummary(
      setAttendanceLoading,
      setRefreshing,
      setattendance,
      auth,
      setIsError,
      sync,
      setLastSyncedRaw,
      false,
      () => {}
    )
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
        isError={isError} 
        routeParams={routeParams}
        />
    </>
  )
}
