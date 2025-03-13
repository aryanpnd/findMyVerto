import { getFriendExams } from "../../../utils/fetchUtils/friendData/handleFriendsData";
import formatExams from "../../../utils/helperFunctions/examsFormatter";
import { friendsStorage } from "../../../utils/storage/storage";
import { AuthContext } from "../../../context/Auth";
import { useContext, useEffect, useState } from "react";
import ExamsScreen from "../../components/exams/ExamsScreen";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import { ExamsSyncTime } from "../../../utils/settings/SyncAndRetryLimits"; // Import the exams sync interval

export default function FriendExams({ route, navigation }) {
  const { auth } = useContext(AuthContext);
  const { id, name } = route.params;
  const [exams, setExams] = useState({});
  const [totalExams, setTotalExams] = useState(0);
  const [examsLoading, setExamsLoading] = useState(false);
  const [examsRefresh, setExamsRefresh] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastSynced, setLastSynced] = useState("");

  const handleExamsFetch = async (sync) => {
    await getFriendExams(
      auth,
      id,
      sync,
      setExams,
      setTotalExams,
      setLastSynced,
      setExamsLoading,
      setExamsRefresh,
      setIsError
    );
  };

  const fetchDataLocally = async () => {
    try {
      setExamsLoading(true);
      const studentRaw = friendsStorage.getString(`${id}-exams`);
      if (studentRaw) {
        const student = JSON.parse(studentRaw);
        const parsedExams = formatExams(student.data.exams);
        setExams(parsedExams);
        setTotalExams(student.data.exams.length);
        setLastSynced(student.lastSynced);

        // Check if auto-sync is enabled and if the stored data is outdated.
        const syncInterval = ExamsSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        const isOutdated =
          autoSyncEnabled &&
          new Date().getTime() - new Date(student.lastSynced).getTime() >
            syncInterval;

        if (isOutdated) {
          Toast.show({
            type: "info",
            text1: "Auto-Syncing Friend Exams",
          });
          // Set the refresh state without full loading.
          setExamsLoading(false);
          setExamsRefresh(true);
          await handleExamsFetch(true);
          setExamsRefresh(false);
        }
      } else {
        await handleExamsFetch(false);
      }
      setExamsLoading(false);
    } catch (error) {
      setExamsLoading(false);
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
      headerRight: () => (
        <Text style={{ color: "white", marginRight: 10 }}>
          Total: {totalExams}
        </Text>
      ),
      headerTitle: `${name}'s Exams`,
    });
  }, [totalExams, name, navigation]);

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
  );
}
