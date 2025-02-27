import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { friendsStorage } from "../../../utils/storage/storage";
import Toast from "react-native-toast-message";
import { getFriendAssignments } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import AssignmentsScreen from "../assignments/AssignmentsScreen";
import { Text } from "react-native";

export default function FriendAssignments({ route, navigation }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [assignments, setAssignments] = useState({})
    const [totalAssignments, setTotalAssignments] = useState(0)
    const [assignmentsLoading, setAssignmentsLoading] = useState(true)
    const [assignmentsRefresh, setAssignmentsRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleAssignmentsFetch = async (sync) => {
        await getFriendAssignments(auth, id, sync, setAssignments, setTotalAssignments, setLastSynced, setAssignmentsLoading, setAssignmentsRefresh, setIsError)
    }

    const fetchDataLocally = async () => {
        try {
            setAssignmentsLoading(true)
            const studentRaw = friendsStorage.getString(`${id}-assignments`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                setAssignments(student.data)
                setTotalAssignments(student.data.theory.length+student.data.practical.length+student.data.reading.length)
                setLastSynced(student.lastSynced)
            } else {
                await handleAssignmentsFetch(false)
            }
            setAssignmentsLoading(false)
        } catch (error) {
            setAssignmentsLoading(false)
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${error.message}`
            });
        }
    }

    useEffect(() => {
        fetchDataLocally()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: 'white', marginRight: 10 }}>Total: {totalAssignments}</Text>
            ),
            headerTitle: `${name}'s Assignments`
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
    )
}