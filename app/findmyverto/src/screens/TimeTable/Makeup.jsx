import { View } from "react-native";
import { AuthContext } from "../../../context/Auth";
import { useContext, useEffect, useState } from "react";
import { fetchMakeup } from "../../../utils/fetchUtils/userData/timeTableFetch";
import MakeupScreen from "../../components/timeTable/MakeupScreen";
import { Text } from "react-native";

export default function Makeup({ navigation }) {
    const { auth } = useContext(AuthContext)
    const [makeup, setMakeup] = useState([])
    const [makeupLoading, setMakeupLoading] = useState(true)
    const [makeupRefresh, setMakeupRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleMakeupFetch = async (sync) => {
        await fetchMakeup(setMakeupLoading, setMakeupRefresh, setMakeup, auth, setIsError, sync, setLastSynced)
    }

    useEffect(() => {
        handleMakeupFetch()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: 'white', marginRight: 10 }}>{makeup.length}</Text>
            )
        });
    }, [makeup]);

    return (
        <MakeupScreen
            makeup={makeup}
            makeupLoading={makeupLoading}
            makeupRefresh={makeupRefresh}
            isError={isError}
            lastSynced={lastSynced}
            handleMakeupFetch={handleMakeupFetch}
        />
    )
}