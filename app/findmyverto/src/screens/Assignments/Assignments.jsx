import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { fetchAssignments } from "../../../utils/fetchUtils/userData/assignmentsFetch";
import AssignmentsScreen from "../../components/assignments/AssignmentsScreen";
import { Text } from "react-native";

export default function Assignments({navigation}) {
    const { auth } = useContext(AuthContext)
    const [Assignments, setAssignments] = useState({})
    const [totalAssignments, setTotalAssignments] = useState(0)
    const [AssignmentsLoading, setAssignmentsLoading] = useState(true)
    const [AssignmentsRefresh, setAssignmentsRefresh] = useState(false)
    const [lastSynced, setLastSynced] = useState("")
    const [isError, setIsError] = useState(false);

    const handleAssignmentsFetch = async (sync) => {
        await fetchAssignments(auth, sync, setAssignments,setTotalAssignments, setAssignmentsLoading, setAssignmentsRefresh, setLastSynced, setIsError)
    }

    useEffect(() => {
        handleAssignmentsFetch()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: 'black', marginRight: 10 }}>{totalAssignments}</Text>
            )
        });
    }
    , [totalAssignments]);

    return (
        <AssignmentsScreen
            assignments={Assignments}
            AssignmentsLoading={AssignmentsLoading}
            AssignmentsRefresh={AssignmentsRefresh}
            isError={isError}
            handleAssignmentsFetch={handleAssignmentsFetch}
            navigation={navigation}
            lastSynced={lastSynced}
        />
    )
}