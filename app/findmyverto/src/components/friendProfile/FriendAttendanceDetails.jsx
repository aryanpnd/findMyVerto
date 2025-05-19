import { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { AuthContext } from '../../../context/Auth'
import { getFriendAttendanceDetails } from '../../../utils/fetchUtils/friendData/handleFriendsData'
import { friendsStorage } from '../../../utils/storage/storage'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { AttendanceSyncTime } from '../../../utils/settings/SyncAndRetryLimits'
import AttendanceDetailsScreen from '../attendance/AttendanceDetailsScreen'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FriendAttendanceDetails({ navigation, route }) {
    const { id, name, subject_code } = route.params;
    const { auth } = useContext(AuthContext);

    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSyncedRaw, setLastSyncedRaw] = useState("");
    const [lastSynced, setLastSynced] = useState("");

    async function fetchAttendance(sync) {
        await getFriendAttendanceDetails(
            auth,
            id,
            sync,
            setAttendanceDetails,
            setLastSynced,
            setLoading,
            setRefresh,
            setIsError
        );
    }

    async function fetchDataLocally() {
        try {
            setLoading(true);
            const studentRaw = friendsStorage.getString(`${id}-attendance-details`);
            if (studentRaw) {
                const student = JSON.parse(studentRaw);

                setAttendanceDetails(student.details.attendance_details);
                setLastSyncedRaw(student.last_updated);
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
                        text1: 'Auto-Syncing Friend Attendance Details'
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
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <AttendanceDetailsScreen
                attendanceDetails={attendanceDetails}
                loading={loading}
                refreshing={refresh}
                lastSynced={lastSynced}
                isError={isError}
                onRefresh={fetchAttendance}
                navigation={navigation}
                self={true}
                name={name}
                subjectCode={subject_code}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },

});
