import { View, StyleSheet, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import { colors } from '../../constants/colors'
import formatTimeAgo from '../../constants/dateFormatter'
import SyncData from '../../components/miscellaneous/SyncData'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'

export default function AttendanceScreen({ attendance, fetchDataLocally, syncAttendaceData, loading, self }) {
  const [lastSynced, setLastSynced] = useState("")

  useEffect(() => {
    fetchDataLocally();
  }, []);

  useEffect(() => {
    setLastSynced(formatTimeAgo(attendance.lastSync))
  }, [attendance]);


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} loadingMsg={"please wait, It may take some minutes"} />}
      
      <View style={styles.container}>
        <SyncData time={lastSynced} syncNow={syncAttendaceData} self={self} color={'white'} bg={colors.blue2} />

        <View style={styles.TotalAttendanceContainer}>
          <AttendanceCard colors={['#2657eb', '#de6161']} attendance={attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1] ?? 0} />
        </View>

        <View style={styles.AttendanceContainer}>
          <ScrollView>
            {
              attendance?.attendanceHistory?.slice(0, -1).map((value) => {
                return (
                  <View style={styles.cardContainer} key={value._id}>
                    <AttendanceCard colors={['#0f2027', '#2c5364']} attendance={value} />
                  </View>
                );
              })
            }
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
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue2,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    // height: '20%'
  },
  AttendanceContainer: {
    flex: 5,
  },
  cardContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
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