import { userStorage } from "../../storage/storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_URL } from "../../../context/Auth";

export const fetchDrives = async (
    auth,
    sync,
    setDrives,
    setTotalDrives,
    setDrivesLoading,
    setDrivesRefresh,
    setLastSynced,
    setIsError,
) => {
    try {
        !sync && setDrivesLoading(true);
        sync && setDrivesRefresh(true);
        let userDrivesRaw = userStorage.getString("DRIVES");
        let userDrives = userDrivesRaw ? JSON.parse(userDrivesRaw) : null;

        if (!userDrives || sync) {
            if (!userDrives || userDrives.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/myDrives`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    userStorage.set("DRIVES", JSON.stringify(result.data));
                    setDrives(result.data.data);
                    setTotalDrives(result.data.data.length);
                    setLastSynced(result.data.lastSynced);
                    Toast.show({
                        type: 'success',
                        text1: "Drives Synced",
                        text2: "Your drives have been synced successfully",
                    });
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                }
            }
        } else {
            setDrives(userDrives.data);
            setTotalDrives(userDrives.data.length);
            setLastSynced(userDrives.lastSynced);
        }
        setDrivesLoading(false);
        setDrivesRefresh(false);
        setIsError(false);
    }
    catch (error) {
        console.error(error);
        let userDrivesRaw = userStorage.getString("DRIVES");
        if (userDrivesRaw) {
            let userDrives = JSON.parse(userDrivesRaw);
            setDrives(userDrives.data);
            setTotalDrives(userDrives.data.length);
            setLastSynced(userDrives.lastSynced);
        }
        setDrivesLoading(false);
        setDrivesRefresh(false);
    }
}