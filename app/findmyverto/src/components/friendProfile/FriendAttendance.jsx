import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL, AuthContext } from '../../../context/Auth'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { getFriendAttendance } from '../../utils/fetchUtils/handleFriendsData'
export default function FriendAttendance({ navigation, route }) {
    const { id,name } = route.params;
    const { auth } = useContext(AuthContext)

    const [attendance, setattendance] = useState({})
    const [attendanceDetails, setAttendanceDetails] = useState({})
    const [lastSynced, setLastSynced] = useState("")
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    async function fetchAttendance() {
        getFriendAttendance(auth, id, setattendance, setAttendanceDetails, setLastSynced, setLoading, setIsError)
    }

    useEffect(() => {
        fetchAttendance()
    }, [])
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${name}'s Attendance`
        });
    }, [navigation]);

    return (
        <>
            <AttendanceScreen attendance={attendance} attendanceDetails={attendanceDetails} fetchAttendance={fetchAttendance} isError={isError} lastSynced={lastSynced} loading={loading} navigation={navigation} self={true} />
        </>
    )
}
