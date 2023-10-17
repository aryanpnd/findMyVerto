import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import TimeTableScreen from '../../components/timeTable/TimeTableScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function TimeTable() {
    const [classesToday, setClassesToday] = useState(0)
    const [timeTable, settimeTable] = useState([])
    const [loading, setLoading] = useState(false)


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


  useEffect(() => {
    fetchTimeTableData()
  }, [])

  
  return (
    <TimeTableScreen timeTable={Object.entries(timeTable)}/>
  )
}