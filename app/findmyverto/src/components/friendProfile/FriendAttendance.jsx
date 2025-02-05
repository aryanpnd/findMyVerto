import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL, AuthContext } from '../../../context/Auth'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { getFriendAttendance, handleFetchAttendance } from '../../../utils/fetchUtils/handleFriendsData'
import { AppContext } from '../../../context/MainApp'
export default function FriendAttendance({ navigation, route }) {
    const { id, name } = route.params;
    const { auth } = useContext(AuthContext);
    const {
        friendsAttendance, setFriendsAttendance,
        friendsAttendanceDetails, setFriendsAttendanceDetails,
        friendsAttendanceLastSynced, setFriendsAttendanceLastSynced
    } = useContext(AppContext);

    const [attendance, setAttendance] = useState({});
    const [attendanceDetails, setAttendanceDetails] = useState({});
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    async function fetchAttendance() {
        await getFriendAttendance(auth, id, setFriendsAttendance, setFriendsAttendanceDetails, setFriendsAttendanceLastSynced, setAttendance, setAttendanceDetails, setLastSynced, setLoading, setIsError);
    }

    useEffect(() => {
        if (Object.keys(friendsAttendance[id] || {}).length === 0) {
            fetchAttendance();
        } else {
            setAttendance(friendsAttendance[id]);
            setAttendanceDetails(friendsAttendanceDetails[id]);
            setLastSynced(friendsAttendanceLastSynced[id]);
        }
    }, []);

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
