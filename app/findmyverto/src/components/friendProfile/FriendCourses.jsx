import CoursesScreen from "../timeTable/CoursesScreen";
import React, { useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getFriendTimetable } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import { friendsStorage } from "../../../utils/storage/storage";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { AuthContext } from "../../../context/Auth";

export default function FriendCourses({ navigation,route }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [timeTable, settimeTable] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [lastSynced, setLastSynced] = useState("")
    const [courses, setCourses] = useState([])
    const [isError, setIsError] = useState(false)

    async function handleFetchCourses(sync) {
        if (loading) return
        await getFriendTimetable(auth, id, sync, settimeTable, setCourses, setLastSynced, setLoading, setRefreshing, setIsError)
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            // const studentRaw = await AsyncStorage.getItem(`${id}-timetable`);
            const studentRaw = friendsStorage.getString(`${id}-timetable`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                // sleep for half second
                // await new Promise((resolve) => setTimeout(resolve, 500));
                setCourses(student.data.courses)
                setLastSynced(student.lastSynced)
            } else {
                await handleFetchCourses(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
            headerTitle: `${name}'s Courses`
        });
    }, [navigation]);

    return (
        <CoursesScreen
            courses={courses}
            handleFetchCourses={handleFetchCourses}
            isError={isError}
            lastSynced={lastSynced}
            refreshing={refreshing}
            self={true}
            timetableLoading={loading}
        />
    )
}