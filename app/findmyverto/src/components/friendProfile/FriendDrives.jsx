import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { getFriendDrives } from "../../../utils/fetchUtils/friendData/handleFriendsDrives";
import { friendsStorage } from "../../../utils/storage/storage";
import Toast from "react-native-toast-message";
import { DrivesSyncTime } from "../../../utils/settings/SyncAndRetryLimits";
import MyDrivesScreen from "../myDrives/MyDrivesScreen";

export default function FriendDrives({ route, navigation }) {
  const { auth } = useContext(AuthContext);
  const { id, name } = route.params;
  const [drives, setDrives] = useState([]);
  const [drivesLoading, setDrivesLoading] = useState(false);
  const [drivesRefresh, setDrivesRefresh] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSynced, setLastSynced] = useState("");

  const handleDrivesFetch = async (sync) => {
    await getFriendDrives(
      auth,
      id,
      sync,
      setDrives,
      setLastSynced,
      setDrivesLoading,
      setDrivesRefresh,
      setIsError
    );
  };

  const fetchDataLocally = async () => {
    try {
      setDrivesLoading(true);
      // Try to retrieve stored drives for this friend.
      const studentRaw = friendsStorage.getString(`${id}-drives`);
      if (studentRaw) {
        const student = JSON.parse(studentRaw);
        // Set the older data immediately.
        setDrives(student.data);
        setLastSynced(student.lastSynced);

        // Check if auto-sync is enabled and if the stored data is outdated.
        const syncInterval = DrivesSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        const isOutdated =
          autoSyncEnabled &&
          new Date().getTime() -
            new Date(student.lastSynced).getTime() >
            syncInterval;

        if (isOutdated) {
          Toast.show({
            type: "info",
            text1: "Auto-Syncing Friend Drives",
          });
          // Set refresh state without showing full loading.
          setDrivesLoading(false);
          setDrivesRefresh(true);
          await handleDrivesFetch(true);
          setDrivesRefresh(false);
        }
      } else {
        // If no stored data exists, perform a standard fetch.
        await handleDrivesFetch(false);
      }
      setDrivesLoading(false);
    } catch (error) {
      setDrivesLoading(false);
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error.message}`,
      });
    }
  };

  useEffect(() => {
    fetchDataLocally();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${name}'s Drives`,
    });
  }, [name, navigation]);

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
  );
}
