import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { AuthContext } from '../../../context/Auth'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { getFriendAttendance } from '../../../utils/fetchUtils/friendData/handleFriendsData'
import { friendsStorage } from '../../../utils/storage/storage'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'

export default function FriendAttendance({ navigation, route }) {
    const { id, name } = route.params;
    const { auth } = useContext(AuthContext);

    const [attendance, setAttendance] = useState({});
    const [attendanceDetails, setAttendanceDetails] = useState({});
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    async function fetchAttendance() {
        await getFriendAttendance(auth, id, setAttendance, setAttendanceDetails, setLastSynced, setLoading, setIsError);
    }

    async function fetchDataLocally() {
        if (loading) return;
        try {
            setLoading(true);
            const studentRaw = friendsStorage.getString(`${id}-attendance`);
            const student = studentRaw && JSON.parse(studentRaw);

            if (studentRaw && new Date().getTime() - new Date(student.last_updated).getTime() > 3600000) {
                await fetchAttendance();
            }
            if (studentRaw) {
                setAttendance(student.summary);
                setAttendanceDetails(student.details);
                setLastSynced(formatTimeAgo(student.last_updated));
            }
            else {
                await fetchAttendance();
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
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
            headerTitle: `${name}'s Attendance`
        });
    }, [navigation]);

    return (
        <AttendanceScreen
            attendance={attendance}
            attendanceDetails={attendanceDetails}
            fetchAttendance={fetchAttendance}
            isError={isError}
            lastSynced={lastSynced}
            loading={loading}
            navigation={navigation}
            self={true}
        />
    );
}
