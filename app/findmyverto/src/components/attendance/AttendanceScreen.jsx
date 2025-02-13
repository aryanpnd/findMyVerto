import { View, StyleSheet, ScrollView, Text, } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import { colors } from '../../constants/colors'
import SyncData from '../../components/miscellaneous/SyncData'
import { ErrorMessage } from '../miscellaneous/errorMessage'
import Loading1 from '../miscellaneous/Loading1'
import AttendanceScreenShimmer from '../shimmers/AttendanceScreenShimmer'

export default function AttendanceScreen({ attendance, fetchAttendance, lastSynced, loading, self, navigation, attendanceDetails, isError }) {
  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      {isError ?
        <ErrorMessage handleFetch={() => fetchAttendance(true)} loading={loading} messageText={"...while fetching the attendance"} buttonStyles={{ height: "8%", width: "50%" }} />
        :
        <View style={styles.container}>
          <SyncData time={lastSynced} syncNow={() => fetchAttendance(true)} self={self} color={'white'} bg={colors.secondary} loader={true} loading={loading} />

          <View style={styles.TotalAttendanceContainer}>
            {loading ?
              <View style={{ height: 150 }}>
                <Loading1 loading={loading} loadAnim={"amongus"} loadingText={"Fetching attendance..."} textColor={"white"} />
              </View>
              :
              <View style={{ height: 150 }}>
                <AttendanceCard colors={['#2657eb', '#de6161']} attendance={attendance?.total_details} />
              </View>
            }
          </View>

          <View style={styles.AttendanceContainer}>
            <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
              {loading ?
                Array(6).fill(0).map((_, index) => (
                  <View style={styles.cardContainer} key={index}>
                    <AttendanceScreenShimmer key={index} />
                  </View>
                  // <Text>dsds</Text>
                ))
                :
                attendance?.attendance_summary && attendance?.attendance_summary?.map((value, index) => {
                  return (
                    <View style={styles.cardContainer} key={index}>
                      <AttendanceCard colors={['#0f2027', '#2c5364']} attendance={value} navigation={navigation}
                        isAggregateCard={attendance.subject_name ? true : false} attendanceDetails={attendanceDetails.attendance_details[value.subject_code]} />
                    </View>
                  );
                })
              }
            </ScrollView>
          </View>
        </View>
      }
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
    flex: 6
  },
  cardContainer: {
    height: 200,
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