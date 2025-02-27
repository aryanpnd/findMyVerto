import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/Auth';
import { getFriendDrives } from '../../../utils/fetchUtils/friendData/handleFriendsDrives';
import { friendsStorage } from '../../../utils/storage/storage';
import MyDrivesScreen from '../myDrives/MyDrivesScreen';

export default function FriendDrives({ route, navigation }) {
    const { auth } = useContext(AuthContext)
    const { id, name } = route.params;
    const [drives, setDrives] = useState([])
    const [drivesLoading, setDrivesLoading] = useState(true)
    const [drivesRefresh, setDrivesRefresh] = useState(false)
    const [isError, setIsError] = useState(false)
    const [lastSynced, setLastSynced] = useState("")

    const handleDrivesFetch = async (sync) => {
        await getFriendDrives(auth, id, sync, setDrives, setLastSynced, setDrivesLoading, setDrivesRefresh, setIsError)
    }

    const fetchDataLocally = async () => {
        try {
            setDrivesLoading(true)
            const studentRaw = friendsStorage.getString(`${id}-drives`)
            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                setDrives(student.data)
                setLastSynced(student.lastSynced)
            } else {
                await handleDrivesFetch(false)
            }
            setDrivesLoading(false)
        } catch (error) {
            setDrivesLoading(false)
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
            headerTitle: `${name}'s Drives`
        });
    }, []);

    return (
        <MyDrivesScreen
            drives={drives}
            drivesLoading={drivesLoading}
            drivesRefresh={drivesRefresh}
            lastSynced={lastSynced}
            handleDrivesFetch={handleDrivesFetch}
            isError={isError}
            navigation={navigation}
        />
    )
}