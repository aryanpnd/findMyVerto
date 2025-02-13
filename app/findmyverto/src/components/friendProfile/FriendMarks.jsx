import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import MarksScreen from "../marksAndCgpa/MarksScreen";
import { fetchFriendMarks } from "../../../utils/fetchUtils/friendData/handleFriendsMarksAndCGPA";
import { friendsStorage } from "../../../utils/storage/storage";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import Toast from "react-native-toast-message";

export default function FriendMarks({ navigation, route }) {
    const { id, name } = route.params;
    const { auth } = useContext(AuthContext);

    const [marks, setMarks] = useState({});
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleMarksFetch = async () => {
        await fetchFriendMarks(auth, id, setMarks, setLastSynced, setLoading, setRefresh, setIsError);
    }

    async function fetchDataLocally() {
        try {
            setLoading(true);
            const studentRaw = friendsStorage.getString(`${id}-marks`);
            if (studentRaw) {
                const student = JSON.parse(studentRaw);
                setMarks(student.data);
                setLastSynced(student.lastSynced);
            } else {
                await handleMarksFetch(false);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${error.message}`
            });
        }
    }

    useEffect(() => {
        fetchDataLocally(false);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${name}'s Marks`
        });
    }, [navigation]);

    return (
        <MarksScreen
            marks={marks}
            marksLoading={loading}
            markRefresh={refresh}
            isError={isError}
            lastSynced={lastSynced}
            handleMarksFetch={handleMarksFetch}
            navigation={navigation}
        />
    );
}