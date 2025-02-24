import { Text } from "react-native";
import MyDrivesScreen from "../../components/myDrives/MyDrivesScreen";
import { fetchDrives } from "../../../utils/fetchUtils/userData/myDrivesFetch";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";

export default function MyDrives({navigation}) {
    const { auth } = useContext(AuthContext)
    const [drives, setDrives] = useState({})
    const [totalDrives, setTotalDrives] = useState(0)
    const [drivesLoading, setDrivesLoading] = useState(true)
    const [drivesRefresh, setDrivesRefresh] = useState(false)
    const [lastSynced, setLastSynced] = useState("")
    const [isError, setIsError] = useState(false);

    const handleDrivesFetch = async (sync) => {
        await fetchDrives(auth, sync, setDrives,setTotalDrives, setDrivesLoading, setDrivesRefresh, setLastSynced, setIsError)
    }

    useEffect(() => {
        handleDrivesFetch()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: 'black', marginRight: 10 }}>{totalDrives}</Text>
            )
        });
    }
    , [totalDrives]);

    return (
        <MyDrivesScreen
            drives={drives}
            drivesLoading={drivesLoading}
            drivesRefresh={drivesRefresh}
            isError={isError}
            handleDrivesFetch={handleDrivesFetch}
            navigation={navigation}
            lastSynced={lastSynced}
        />
    )
}