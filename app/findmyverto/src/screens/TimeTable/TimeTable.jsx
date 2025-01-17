import { View, Text, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import TimeTableScreen from '../../components/timeTable/TimeTableScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import SyncData from '../../components/miscellaneous/SyncData'
import { colors } from '../../constants/colors'
import { API_URL, AuthContext } from '../../../context/Auth'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import formatTimeAgo from '../../constants/dateFormatter'
import Toast from 'react-native-toast-message'

export default function TimeTable() {
  const { auth,logout2 } = useContext(AuthContext)
  const [classesToday, setClassesToday] = useState(0)
  const [timeTable, settimeTable] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastSynced, setLastSynced] = useState("")


  async function fetchTimeTableData() {
    try {
      setLoading(true)
      let userTimeTable = await AsyncStorage.getItem("TIMETABLE");
      if (!userTimeTable) {
        await axios.post(`${API_URL}/api/student/getStudentTimeTable`, { password: auth.pass }).then(async (result) => {
          await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
          settimeTable(result.data)
          setClassesToday(tt.length)
          setLoading(false)
        }).catch((err) => {
          Toast.show({
            type: 'error',
            text1: 'Error fetching Time table',
            text2: `${err}`,
          });
          console.log({ "inside catch": err });
          setLoading(false)
        })
        return
      }
      setLoading(false)
      const tt = JSON.parse(userTimeTable)
      setClassesToday(tt.length)
      settimeTable(tt)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  async function syncTimetableData() {
    setLoading(true)
    await axios.post(`${API_URL}/api/student/getStudentTimeTable`, { password: auth.pass, sync: true }).then(async (result) => {
      await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
      settimeTable(result.data)
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
      Alert.alert('Logout', 'Due to error while syncing your data from the UMS server you have been logout, This because you might have changed your UMS password or it has been expired, try it again after logging with your new password, if it still happens then it would be something from our end, try it after some time :) ', [
        {text: 'Okay', onPress: async () => logout2()},
      ]);
      console.log({ "inside catch": err });
      setLoading(false)
    })
    return
  }

  useEffect(() => {
    fetchTimeTableData()
  }, [])

  useEffect(() => {
    setLastSynced(formatTimeAgo(timeTable.lastSync))
  }, [timeTable]);


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SyncData self={true} syncNow={syncTimetableData} time={lastSynced} color={"white"} bg={colors.secondary} />
      {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} loadingMsg={"please wait, It may take some minutes"} />}
      {
        loading?
        <></>
        :
        <TimeTableScreen timeTable={Object.entries(timeTable)} />
      }
    </>
  )
}