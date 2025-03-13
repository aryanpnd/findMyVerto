import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import AttendanceCard from '../../components/attendance/AttendanceCard';
import { colors } from '../../constants/colors';
import SyncData from '../../components/miscellaneous/SyncData';
import { ErrorMessage } from '../miscellaneous/errorMessage';
import Loading1 from '../miscellaneous/Loading1';
import AttendanceScreenShimmer from '../shimmers/AttendanceScreenShimmer';
import { HEIGHT, WIDTH } from '../../constants/styles';

export default function AttendanceScreen({
  attendance,
  fetchAttendance,
  lastSynced,
  loading,
  refresh,
  self,
  navigation,
  attendanceDetails,
  isError,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter attendance summary based on searchQuery
  const filteredAttendance = attendance?.attendance_summary?.filter((value) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (value.subject_name && value.subject_name.toLowerCase().includes(query)) ||
      (value.subject_code && value.subject_code.toLowerCase().includes(query)) ||
      (value.agg_attendance && value.agg_attendance.toString().includes(query))
    );
  });

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      {isError ? (
        <ErrorMessage
          handleFetch={() => fetchAttendance(true)}
          loading={loading}
          messageText={"...while fetching the attendance"}
          buttonStyles={{ height: '8%', width: '50%' }}
        />
      ) : (
        <View style={styles.container}>
          <SyncData
            time={lastSynced}
            syncNow={() => fetchAttendance(true)}
            self={self}
            color={'white'}
            bg={colors.secondary}
            loader={true}
            loading={refresh ? refresh : loading}
          />

          {/* Only show aggregate attendance when search bar is not focused */}
          {!isFocused && (
            <View style={styles.TotalAttendanceContainer}>
              {loading ? (
                <View style={{ height: 150 }}>
                  <Loading1
                    loading={loading}
                    loadAnim={'amongus'}
                    loadingText={'Fetching attendance...'}
                    textColor={'white'}
                  />
                </View>
              ) : (
                <AttendanceCard
                  colors={['#2657eb', '#de6161']}
                  attendance={attendance?.total_details}
                />
              )}
            </View>
          )}

          <View style={styles.AttendanceContainer}>
            <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
              <TextInput
                style={styles.searchBar}
                placeholder='Search by subject name, code, or percentage...'
                placeholderTextColor={'grey'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <View style={styles.cardContainer} key={index}>
                      <AttendanceScreenShimmer key={index} />
                    </View>
                  ))
              ) : (
                filteredAttendance &&
                filteredAttendance.map((value, index) => {
                  return (
                    <View style={styles.cardContainer} key={index}>
                      <AttendanceCard
                        colors={['#0f2027', '#2c5364']}
                        attendance={value}
                        navigation={navigation}
                        isAggregateCard={attendance.subject_name ? true : false}
                        attendanceDetails={
                          attendanceDetails.attendance_details[value.subject_code]
                        }
                      />
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    height: '100%',
  },
  TotalAttendanceContainer: {
    // flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // height: HEIGHT(22),
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: colors.secondary,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  AttendanceContainer: {
    flex: 6,
  },
  searchBar: {
    width: WIDTH(95),
    height: HEIGHT(6),
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    alignSelf: 'center',
    // marginTop: 10,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
