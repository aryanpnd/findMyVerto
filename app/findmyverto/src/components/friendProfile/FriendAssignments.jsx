import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { friendsStorage } from "../../../utils/storage/storage";
import Toast from "react-native-toast-message";
import { getFriendAssignments } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import AssignmentsScreen from "../assignments/AssignmentsScreen";
import { Text } from "react-native";
import { AssignmentsSyncTime } from "../../../utils/settings/SyncAndRetryLimits";

export default function FriendAssignments({ route, navigation }) {
    const { auth } = useContext(AuthContext);
    const { id, name } = route.params;
    const [assignments, setAssignments] = useState({});
    const [totalAssignments, setTotalAssignments] = useState(0);
    const [assignmentsLoading, setAssignmentsLoading] = useState(false);
    const [assignmentsRefresh, setAssignmentsRefresh] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("");

    const handleAssignmentsFetch = async (sync) => {
        await getFriendAssignments(
            auth,
            id,
            sync,
            setAssignments,
            setTotalAssignments,
            setLastSynced,
            setAssignmentsLoading,
            setAssignmentsRefresh,
            setIsError
        );
    };

    const fetchDataLocally = async () => {
        try {
            setAssignmentsLoading(true);
            // Try to retrieve stored assignments for this friend.
            const studentRaw = friendsStorage.getString(`${id}-assignments`);
            if (studentRaw) {
                const student = JSON.parse(studentRaw);
                // Set the older data immediately.
                setAssignments(student.data);
                setTotalAssignments(
                    student.data.theory.length +
                    student.data.practical.length +
                    student.data.reading.length
                );
                setLastSynced(student.lastSynced);

                // Check if auto-sync is enabled and the data is outdated.
                const syncInterval = AssignmentsSyncTime();
                const autoSyncEnabled = syncInterval > 0;
                const isOutdated =
                    autoSyncEnabled &&
                    new Date().getTime() -
                    new Date(student.lastSynced).getTime() >
                    syncInterval;
                if (isOutdated) {
                    Toast.show({
                        type: "info",
                        text1: "Auto-Syncing Friend Assignments",
                    });
                    // Set the refresh state without showing full loading.
                    setAssignmentsLoading(false);
                    setAssignmentsRefresh(true);
                    await handleAssignmentsFetch(true);
                    setAssignmentsRefresh(false);
                }
            } else {
                // If there's no stored data, show the loading indicator.
                await handleAssignmentsFetch(false);
            }
            setAssignmentsLoading(false);
        } catch (error) {
            setAssignmentsLoading(false);
            setAssignmentsRefresh(false);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: `${error.message}`,
            });
        }
    };

    useEffect(() => {
        fetchDataLocally();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: "white", marginRight: 10 }}>
                    Total: {totalAssignments}
                </Text>
            ),
            headerTitle: `${name}'s Assignments`,
        });
    }, [totalAssignments]);

    return (
        <AssignmentsScreen
            assignments={assignments}
            AssignmentsLoading={assignmentsLoading}
            AssignmentsRefresh={assignmentsRefresh}
            isError={isError}
            lastSynced={lastSynced}
            handleAssignmentsFetch={handleAssignmentsFetch}
            navigation={navigation}
        />
    );
}
