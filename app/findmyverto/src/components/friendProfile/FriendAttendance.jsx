import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { AuthContext } from '../../../context/Auth'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'
import { getFriendAttendance } from '../../../utils/fetchUtils/friendData/handleFriendsData'
import { friendsStorage } from '../../../utils/storage/storage'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { AttendanceSyncTime } from '../../../utils/settings/SyncAndRetryLimits'

export default function FriendAttendance({ navigation, route }) {
    const { id, name } = route.params;
    const { auth } = useContext(AuthContext);

    const [attendance, setAttendance] = useState({});
    const [attendanceDetails, setAttendanceDetails] = useState({});
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);

    async function fetchAttendance(sync) {
        await getFriendAttendance(auth, sync, id, setAttendance, setAttendanceDetails, setLastSynced, setLoading, setRefresh, setIsError);
    }

    async function fetchDataLocally() {
        try {
            setLoading(true);
            const studentRaw = friendsStorage.getString(`${id}-attendance`);
            if (studentRaw) {
                const student = JSON.parse(studentRaw);

                setAttendance(student.summary);
                setAttendanceDetails(student.details);
                setLastSynced(formatTimeAgo(student.last_updated));

                // Check if auto-sync is enabled and the data is outdated.
                const syncInterval = AttendanceSyncTime();
                const autoSyncEnabled = syncInterval > 0;
                const isOutdated =
                    autoSyncEnabled &&
                    new Date().getTime() - new Date(student.last_updated).getTime() > syncInterval;
                if (isOutdated) {
                    Toast.show({
                        type: 'info',
                        text1: 'Auto-Syncing Friend Attendance'
                    });
                    setLoading(false);
                    setRefresh(true);
                    await fetchAttendance(false);
                    setRefresh(false);

                }
            } else {
                await fetchAttendance(true);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setRefresh(false);
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
            refresh={refresh}
        />
    );
}
