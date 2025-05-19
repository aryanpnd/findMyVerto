import { useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../context/Auth";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/MainApp";
import { fetchAttendanceDetails } from "../../../utils/fetchUtils/userData/attendanceFetch";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import AttendanceDetailsScreen from "../../components/attendance/AttendanceDetailsScreen";

export default function AttendanceDetails({ navigation }) {
    const route = useRoute();
    const { name, subject_code, self = true } = route.params;
    const { auth } = useContext(AuthContext);

    const {
        attendanceDetailsLoading, setAttendanceDetailsLoading,
        attendanceDetailsRefreshing, setAttendanceDetailsRefreshing
    } = useContext(AppContext);
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [isError, setIsError] = useState(false);
    const [lastSyncedRaw, setLastSyncedRaw] = useState("");
    const [lastSynced, setLastSynced] = useState("");

    const handleAttendanceFetch = async (sync) => {
        if (attendanceDetailsLoading) return;

        await fetchAttendanceDetails(
            setAttendanceDetailsLoading,
            setAttendanceDetailsRefreshing,
            setAttendanceDetails,
            auth,
            setIsError,
            sync,
            setLastSyncedRaw,
            false
        );
    };

    useEffect(() => {
        handleAttendanceFetch();
    }, []);

    useEffect(() => {
        setLastSynced(formatTimeAgo(lastSyncedRaw));
    }, [lastSyncedRaw]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <AttendanceDetailsScreen
                subjectCode={subject_code}
                name={name}
                self={self}
                attendanceDetails={attendanceDetails}
                loading={attendanceDetailsLoading}
                refreshing={attendanceDetailsRefreshing}
                lastSynced={lastSynced}
                isError={isError}
                onRefresh={() => handleAttendanceFetch(true)}
                navigation={navigation}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },

});
