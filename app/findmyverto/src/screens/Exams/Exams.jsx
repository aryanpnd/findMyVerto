import { useContext, useEffect, useState } from "react";
import { fetchExams } from "../../../utils/fetchUtils/userData/examsFetch";
import ExamsScreen from "../../components/exams/ExamsScreen";
import { AuthContext } from "../../../context/Auth";
import { Text } from "react-native";

export default function Exams({navigation}) {
    const { auth } = useContext(AuthContext)
    const [exams, setExams] = useState({})
    const [totalExams, setTotalExams] = useState(0)
    const [examsLoading, setExamsLoading] = useState(true)
    const [examsRefresh, setExamsRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleExamsFetch = async (sync) => {
        await fetchExams(auth, sync, setExams,setTotalExams, setLastSynced, setExamsLoading, setExamsRefresh, setIsError)
    }

    useEffect(() => {
        handleExamsFetch()

    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: 'white', marginRight: 10 }}>Total: {totalExams}</Text>
            ),
            headerTitle: `Exams`
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