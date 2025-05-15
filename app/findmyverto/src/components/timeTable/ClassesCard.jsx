import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles } from '../../constants/styles';
import { colors } from '../../constants/colors';
import { getDay, isTimeEqual } from '../../../utils/helperFunctions/dataAndTimeHelpers';
import CourseDetailsModal from './CourseDetailsModal';
import ButtonV1 from '../miscellaneous/buttons/ButtonV1';

export default function ClassesCard({ time, classes, courses, day, friend }) {
  const [ongoing, setOngoing] = useState(false);
  const courseDetailSheetRef = useRef();

  const checkOngoing = () => {
    const isOngoing = isTimeEqual(time) && day === getDay();
    setOngoing(isOngoing);
  };

  useEffect(() => {
    checkOngoing();
  }, [classes]);

  const handlePress = () => {
    if (classes && classes.length > 0) {
      courseDetailSheetRef.current?.open();
    }
  };

  return (
    <>
      <ButtonV1 onPress={handlePress}>
        <LinearGradient
          colors={["white", "white"]}
          style={[
            styles.container,
            globalStyles.elevationMin,
            ongoing && { borderWidth: 2, borderColor: colors.green }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Class Time */}
          <LinearGradient
            colors={ongoing ? ['#a8e063', '#56ab2f'] : ["white", "white"]}
            style={[styles.timeContainer, ongoing && { borderWidth: 0 }]}
          >
            <Image
              source={require("../../../assets/icons/clock.png")}
              style={{ height: 20, width: 20 }}
              transition={1000}
            />
            <Text style={[styles.text2, ongoing && { color: "white" }]}>{time}</Text>
            {ongoing && <Text style={{ color: "white", fontWeight: 'bold' }}>Ongoing</Text>}
          </LinearGradient>

          <View style={styles.classesContainer}>
            {classes?.map((classDetail, index) => (
              <View style={styles.classValues} key={index}>
                <View>
                  <Text style={styles.text1}>
                    {classDetail.class} - {classDetail.className}
                  </Text>
                </View>
                <View style={styles.classInfoContainer}>
                  <View style={[styles.btnEffect, { borderWidth: classDetail.makeup ? 1 : 0, borderColor: colors.orange }]}>
                    <Image
                      source={require("../../../assets/icons/building.png")}
                      style={{ height: 20, width: 20 }}
                      transition={1000}
                    />
                    <Text style={styles.text2}>{classDetail.room}</Text>
                  </View>
                  <View style={styles.btnEffect}>
                    <Text style={styles.text2}>Section: {classDetail.section}</Text>
                  </View>
                </View>
                <View style={styles.classInfoContainer}>
                  <View style={styles.btnEffect}>
                    <Text style={styles.text2}>Group: {classDetail.group}</Text>
                  </View>
                  <View style={styles.btnEffect}>
                    <Text style={styles.text2}>Type: {classDetail.type}</Text>
                  </View>
                </View>
                {classes.length > 1 && index !== classes.length - 1 && (
                  <View style={styles.divider}></View>
                )}
              </View>
            ))}
          </View>
        </LinearGradient>
      </ButtonV1>

      {/* Render the multi-course modal */}
      <CourseDetailsModal
        courses={courses}
        classes={classes}
        friend={friend}
        ref={courseDetailSheetRef}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  timeContainer: {
    borderWidth: 1,
    borderColor: '#c31432',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    gap: 10,
  },
  classesContainer: {
    justifyContent: 'space-between',
    width: '75%',
    gap: 10,
  },
  classValues: {
    justifyContent: 'space-between',
    padding: 2,
    gap: 10,
  },
  classInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnEffect: {
    padding: 5,
    backgroundColor: colors.btn1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  text1: {
    color: 'grey',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text2: {
    color: 'grey',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.disabledBackground,
    marginVertical: 5,
    alignSelf: 'center',
  },
});