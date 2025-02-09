import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { fetchFriendCGPA } from "../../../utils/fetchUtils/friendData/handleFriendsMarksAndCGPA";
import { friendsStorage } from "../../../utils/storage/storage";
import Toast from "react-native-toast-message";
import CgpaScreen from "../marksAndCgpa/CgpaScreen";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";

export default function FriendCGPA({ navigation, route }) {
    const { id, name } = route.params;
    const { auth } = useContext(AuthContext);

    const [cgpa, setCgpa] = useState({});
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleCgpaFetch = async () => {
        await fetchFriendCGPA(auth, id, setCgpa, setLastSynced, setLoading, setRefresh, setIsError);
    }

    async function fetchDataLocally() {
        try {
            setLoading(true);
            const studentRaw = friendsStorage.getString(`${id}-cgpa`);
            if (studentRaw) {
                const student = JSON.parse(studentRaw);
                setCgpa(student.data.cgpa);
                console.log(student.lastSynced);
                
                setLastSynced(student.lastSynced);
            } else {
                await handleCgpaFetch(false);
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
            headerTitle: `${name}'s CGPA`
        });
    }, [navigation]);

    return (
        <CgpaScreen
            cgpa={cgpa}
            cgpaLoading={loading}
            cgpaRefresh={refresh}
            isError={isError}
            lastSynced={lastSynced}
            handleCgpaFetch={handleCgpaFetch}
            navigation={navigation}
        />
    );
}