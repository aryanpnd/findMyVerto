import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import { API_URL, AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { colors } from '../../constants/colors'
import formatTimeAgo from '../../constants/dateFormatter'
import SyncData from '../../components/miscellaneous/SyncData'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import AttendanceScreen from '../../components/attendance/AttendanceScreen'

export default function Attendance({ navigation }) {
  const { auth } = useContext(AuthContext)
  const [attendance, setattendance] = useState({})
  const [loading, setLoading] = useState(false)

  async function fetchDataLocally() {
    try {
      let userAttendance = await AsyncStorage.getItem("ATTENDANCE");
      setattendance(JSON.parse(userAttendance))
    } catch (error) {
      console.error(error);
    }
  }

  async function syncAttendaceData() {
    setLoading(true)
    await axios.post(`${API_URL}/api/student/getStudentAttendance`, { password: auth.pass, sync: true }).then(async (result) => {
      await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data));
      setattendance(result.data)
      setLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Data synced successfully',
      });
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: `${err}`,
      });
      console.log({ "inside catch": err });
      setLoading(false)
    })
    return
  }

  return (
    <>
      <AttendanceScreen attendance={attendance} fetchDataLocally={fetchDataLocally} loading={loading} self={true} syncAttendaceData={syncAttendaceData} />
    </>
  )
}
