import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import { API_URL, AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function Attendance({ navigation }) {
  const { auth } = useContext(AuthContext)
  const [attendance, setattendance] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchDataLocally() {
      try {
        let userAttendance = await AsyncStorage.getItem("ATTENDANCE");
        if (!userAttendance) {
          await axios.post(`${API_URL}/api/student/getStudentAttendance`, { regNo: auth.regNo, password: auth.pass }).then(async (result) => {
            await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data))
            setattendance(result.data)
            setLoading(false)
            //   console.log({ "inside if then": result });
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
        setattendance(JSON.parse(userAttendance))
      } catch (error) {
        console.error(error);
      }
    }
    fetchDataLocally();
  }, []);

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <View style={styles.container}>
        <View style={styles.TotalAttendanceContainer}>
          <AttendanceCard attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
        </View>

        <View style={styles.AttendanceContainer}>
          <ScrollView>
            <View style={styles.cardContainer}>
              <AttendanceCard attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
            </View>
            <View style={styles.cardContainer}>
              <AttendanceCard attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
            </View>
            <View style={styles.cardContainer}>
              <AttendanceCard attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
            </View>
            <View style={styles.cardContainer}>
              <AttendanceCard attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  TotalAttendanceContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    // height: '20%'
  },
  AttendanceContainer: {
    flex: 5,
    backgroundColor: 'red'
  },
  cardContainer: {
    height: 150, // Set an appropriate height for your cards
    marginBottom: 20, // Add spacing between cards
    backgroundColor: 'white', // Set the background color of your cards
    borderRadius: 8, // Add border radius to cards
    elevation: 2, // Add elevation (for Android shadow)
    shadowColor: 'black', // Add shadow color (for iOS shadow)
    shadowOffset: { width: 0, height: 1 }, // Add shadow offset
    shadowOpacity: 0.3, // Add shadow opacity
  },
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 20,
  },
});