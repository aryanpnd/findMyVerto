import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import AttendanceCard from '../../components/attendance/AttendanceCard';
import { colors } from '../../constants/colors';
import SyncData from '../../components/miscellaneous/SyncData';
import Loading1 from '../miscellaneous/Loading1';
import AttendanceScreenShimmer from '../shimmers/AttendanceScreenShimmer';
import { HEIGHT, WIDTH } from '../../constants/styles';
import { ErrorMessage } from '../timeTable/ErrorMessage';
import { Entypo } from '@expo/vector-icons';

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
  routeParams,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (routeParams && routeParams.courseCode) {
      setSearchQuery(routeParams.courseCode);
    }
  }, [routeParams]);

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
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ErrorMessage 
            handleFetchTimetable={() => fetchAttendance(true)} 
            timetableLoading={loading || refresh} 
            buttonHeight={45} 
            ErrorMessage={"Attendance"} 
          />
        </View>
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
            <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 10 }} 
            keyboardShouldPersistTaps="handled">
              {/* Wrap TextInput inside a view to overlay the clear icon */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchBar}
                  placeholder='Search by subject name, code, or percentage...'
                  placeholderTextColor={'grey'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                {searchQuery.trim() !== '' && (
                  <TouchableOpacity 
                    style={styles.clearIconContainer} 
                    onPress={() => setSearchQuery('')}
                  >
                    <Entypo name="circle-with-cross" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>

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
                filteredAttendance.map((value, index) => (
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
                ))
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
    width: '100%',
    height: '100%',
  },
  TotalAttendanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: colors.secondary,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  AttendanceContainer: {
    flex: 6,
  },
  searchContainer: {
    width: WIDTH(95),
    alignSelf: 'center',
    position: 'relative',
  },
  searchBar: {
    width: '100%',
    height: HEIGHT(6),
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: 'grey',
    backgroundColor: 'white',
  },
  clearIconContainer: {
    position: 'absolute',
    right: 15,
    top: '45%',
    transform: [{ translateY: -10 }],
  },
  clearIcon: {
    fontSize: 20,
    color: 'grey',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
