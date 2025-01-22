import { View, StyleSheet, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import { colors } from '../../constants/colors'
import SyncData from '../../components/miscellaneous/SyncData'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'
import formatTimeAgo from '../../utils/helperFunctions/dateFormatter'

export default function AttendanceScreen({ attendance, fetchAttendance,lastSynced, loading, self }) {
  const [lastSyncedState, setLastSyncedState] = useState("")

  useEffect(() => {
    fetchAttendance(false);
  }, []);

  useEffect(() => {
    setLastSyncedState(formatTimeAgo(lastSynced))
  }, [lastSynced]);


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} />}
      
      <View style={styles.container}>
        <SyncData time={lastSyncedState} syncNow={()=>fetchAttendance(true)} self={self} color={'white'} bg={colors.secondary} />

        <View style={styles.TotalAttendanceContainer}>
          <AttendanceCard colors={['#2657eb', '#de6161']} attendance={attendance?.total_details} />
        </View>

        <View style={styles.AttendanceContainer}>
          <ScrollView>
            {
              attendance?.attendance_summary?.map((value,index) => {
                return (
                  <View style={styles.cardContainer} key={index}>
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
    backgroundColor: colors.secondary,
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