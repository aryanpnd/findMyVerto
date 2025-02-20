// utils/fetchUtils/userData/examsFetch.js
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../../context/Auth';
import { userStorage } from '../../storage/storage';
import formatExams from '../../helperFunctions/examsFormatter';

export async function fetchExams(
    auth,
    sync,
    setExams,
    setTotalExams,
    setLastSynced,
    setExamsLoading,
    setExamsRefresh,
    setIsError,
) {
    try {
        !sync && setExamsLoading(true);
        sync && setExamsRefresh(true);
        let userExamsRaw = userStorage.getString("EXAMS");
        let userExams = userExamsRaw ? JSON.parse(userExamsRaw) : null;

        if (!userExams || sync) {
            if (!userExams || userExams.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/exams`, { password: auth.password, reg_no: auth.reg_no });
                if (result.data.success) {
                    userStorage.set("EXAMS", JSON.stringify(result.data));
                    const parsedExams = formatExams(result.data.data.exams);
                    setExams(parsedExams);
                    setTotalExams(result.data.data.exams.length);
                    setLastSynced(result.data.lastSynced);
                    Toast.show({
                        type: 'success',
                        text1: "Exams Synced",
                        text2: "Your exams have been synced successfully",
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                }
            }
        } else {
            const parsedExams = formatExams(userExams.data.exams);
            setExams(parsedExams);
            setTotalExams(userExams.data.exams.length);
            setLastSynced(userExams.lastSynced);
        }
        setExamsLoading(false);
        setExamsRefresh(false);
        setIsError(false);
    } catch (error) {
        console.error(error);
        let userExamsRaw = userStorage.getString("EXAMS");
        if (userExamsRaw) {
            let userExams = JSON.parse(userExamsRaw);
            const parsedExams = formatExams(userExams.data.exams);
            setExams(parsedExams);
            setTotalExams(userExams.data.exams.length);
            setLastSynced(userExams.lastSynced);
        }
        setExamsLoading(false);
        setExamsRefresh(false);
        setIsError(true);
        Toast.show({
            type: 'error',
            text1: "Error fetching Exams",
            text2: `${error.message}`,
        });
    }
}