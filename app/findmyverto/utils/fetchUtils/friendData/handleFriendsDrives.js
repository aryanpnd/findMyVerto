import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../../context/Auth';
import { friendsStorage } from '../../../utils/storage/storage';

export const getFriendDrives = async (auth, studentId,sync, setDrives, setLastSynced, setLoading, setRefresh, setIsError) => {
    !sync && setLoading(true)
    sync && setRefresh(true)
    await axios.post(`${API_URL}/friends/drives`, { reg_no: auth.reg_no, password: auth.password, studentId: studentId, sync: sync })
        .then(async (result) => {
            if (result.data.success) {
                friendsStorage.set(`${studentId}-drives`, JSON.stringify(result.data));
                setDrives(result.data.data);
                setLastSynced(result.data.lastSynced);
                setIsError(false);
                Toast.show({
                    type: 'success',
                    text1: 'Drives Synced',
                    text2: 'Drives synced successfully'
                });
            } else {
                setIsError(true);
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage
                });
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
            setIsError(true);
        })
        .finally(() => {
            setLoading(false);
            setRefresh(false)
        })
}
