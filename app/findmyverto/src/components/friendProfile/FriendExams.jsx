import { getFriendExams } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import formatExams from "../../../utils/helperFunctions/examsFormatter";
import { friendsStorage } from "../../../utils/storage/storage";
import { AuthContext } from "../../../context/Auth";
import { useContext, useEffect, useState } from "react";
import ExamsScreen from "../../components/exams/ExamsScreen";
import { Text } from "react-native";
import Toast from "react-native-toast-message";

export default function FriendExams({ route, navigation }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [exams, setExams] = useState({})
    const [totalExams, setTotalExams] = useState(0)
    const [examsLoading, setExamsLoading] = useState(true)
    const [examsRefresh, setExamsRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleExamsFetch = async (sync) => {
        await getFriendExams(auth, id, sync, setExams, setTotalExams, setLastSynced, setExamsLoading, setExamsRefresh, setIsError)
    }

    const fetchDataLocally = async () => {
        try {
            setExamsLoading(true)
            const studentRaw = friendsStorage.getString(`${id}-exams`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                const parsedExams = formatExams(student.data.exams);
                setExams(parsedExams)
                setTotalExams(student.data.exams.length)
                setLastSynced(student.lastSynced)
            } else {
                await handleExamsFetch(false)
            }
            setExamsLoading(false)
        } catch (error) {
            setExamsLoading(false)
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
                <Text style={{ color: 'white', marginRight: 10 }}>Total: {totalExams}</Text>
            ),
            headerTitle: `${name}'s Exams`
        });
    }, [totalExams]);

    return (
        <ExamsScreen
            exams={exams}
            examsLoading={examsLoading}
            examsRefresh={examsRefresh}
            isError={isError}
            lastSynced={lastSynced}
            handleExamsFetch={handleExamsFetch}
            navigation={navigation}
        />
    )
}