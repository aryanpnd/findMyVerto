import axios from "axios";
import Toast from "react-native-toast-message";
import { API_URL } from "../../../context/Auth";

export async function handleSetAllowedFieldsToShow(auth, fields, setFields, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/student/settings/allowedFieldsToShow/set`, { reg_no: auth.reg_no, password: auth.password, fields })
        .then(async (result) => {
            if (result.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Updated',
                })
                setFields(result.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        })
}

export async function getAllowedFieldsToShow(auth, setFields,setTempFields, setLoading) {
    setLoading(true)
    await axios.post(`${API_URL}/student/settings/allowedFieldsToShow`, { reg_no: auth.reg_no, password: auth.password })
        .then(async (result) => {
            if (result.data.success) {
                setFields(result.data.data);
                setTempFields(result.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: result.data.message,
                    text2: result.data.errorMessage,
                })
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: err.message,
            });
            console.log(err.message);
        })
        .finally(() => {
            setLoading(false);
        })
}