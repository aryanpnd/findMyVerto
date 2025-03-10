import { userStorage } from "../../storage/storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { auth } from "../../../context/Auth";
import { DrivesSyncTime } from "../../settings/SyncAndRetryLimits";

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
        if (!sync) setDrivesLoading(true);
        if (sync) setDrivesRefresh(true);

        let userDrivesRaw = userStorage.getString("DRIVES");
        let userDrives = userDrivesRaw ? JSON.parse(userDrivesRaw) : null;

        // Retrieve the sync interval for drives (in ms)
        const syncInterval = DrivesSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        let isOutdated = false;
        if (userDrives && userDrives.lastSynced) {
            isOutdated = (new Date().getTime() - new Date(userDrives.lastSynced).getTime() > syncInterval);
        }

        // Decide whether to fetch new data:
        // - If no stored drives exist.
        // - If forced sync is requested.
        // - If auto-sync is enabled and stored data is outdated.
        // If auto-sync is off (syncInterval === 0) and data exists, use stored data unless forced.
        if (!userDrives || sync || (autoSyncEnabled && isOutdated)) {
            if (syncInterval === 0 && !sync && userDrives) {
                // Auto-sync is off and data exists – do nothing.
            } else {
                if (autoSyncEnabled && isOutdated) {
                    setDrivesRefresh(true);
                    setDrivesLoading(false);
                    Toast.show({
                        type: 'info',
                        text1: "Auto-Syncing Drives"
                    });
                }
                const result = await axios.post(`${auth.server.url}/student/myDrives`, {
                    password: auth.password,
                    reg_no: auth.reg_no
                });
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
                    setIsError(false);
                    userDrives = result.data;
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    setIsError(true);
                }
            }
        } else {
            setDrives(userDrives.data);
            setTotalDrives(userDrives.data.length);
            setLastSynced(userDrives.lastSynced);
        }
        setDrivesLoading(false);
        setDrivesRefresh(false);
    } catch (error) {
        console.error(error);
        let userDrivesRaw = userStorage.getString("DRIVES");
        if (userDrivesRaw) {
            let userDrives = JSON.parse(userDrivesRaw);
            setDrives(userDrives.data);
            setTotalDrives(userDrives.data.length);
            setLastSynced(userDrives.lastSynced);
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: "Something went wrong"
            });
        }
        setDrivesLoading(false);
        setDrivesRefresh(false);
    }
};
