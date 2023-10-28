import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL, AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'

export default function FriendAttendance({ navigation, route }) {
    const { _id } = route.params;

    const [attendance, setattendance] = useState({})
    const [loading, setLoading] = useState(false)

    async function fetchData(sync) {
        setLoading(true)
        await axios.post(`${API_URL}/api/student/getFriendData`, { studentId: _id }).then(async (result) => {
            await AsyncStorage.setItem(`${_id}`, JSON.stringify(result.data))
            setattendance(result.data.attendance)
            setLoading(false)
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: `${err}`,
            });
            setLoading(false)
        })
        return
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            let user = await AsyncStorage.getItem(`${_id}`);
            if (!user) {
                fetchData(false)
                setLoading(false)
                return
            }
            const studentParsed = JSON.parse(user)
            setattendance(studentParsed.attendance)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataLocally()
    }, [])

    return (
        <>
            {Object.entries(attendance).length > 1 && <AttendanceScreen attendance={attendance} fetchDataLocally={fetchDataLocally} loading={loading} self={false} />}
        </>
    )
}
