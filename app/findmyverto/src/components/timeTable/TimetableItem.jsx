import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import BreakCard from '../timeTable/BreakCard';
import ClassesCard from '../timeTable/ClassesCard';
import { isTimeEqual, getDay } from '../../../utils/helperFunctions/dataAndTimeHelpers';

const { width } = Dimensions.get('screen');

export default function TimetableItem({ classes,courses, index, friend }) {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const ongoingIndex = classes.findIndex(classDetails =>
      isTimeEqual(classDetails?.time) && getDay() === index
    );
    if (ongoingIndex !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: ongoingIndex * 100,
        animated: true,
      });
    }
  }, [classes, index]);

  return (
    <Animated.View style={styles.itemContainer}>
      <View style={styles.items}>
        {!classes[0]?.time ? (
          <View style={styles.noClassesContainer}>
            <LottieView
              autoPlay
              style={{ width: 200, height: 200 }}
              source={require('../../../assets/lotties/sleep.json')}
            />
            <Text style={styles.text1}>No classes for today</Text>
            <Text style={styles.text1}>Have fun...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}>
            {classes.map((classDetails, idx) =>
              classDetails?.break ? (
                <BreakCard key={idx} time={classDetails?.time} day={index} />
              ) : (
                <ClassesCard key={idx} time={classDetails?.time} classes={classDetails?.class} day={index} courses={courses} friend={friend} />
              )
            )}
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: '100%',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    height: '100%',
    width: '100%',
  },
  noClassesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: width,
    height: '100%',
  },
  text1: {
    color: 'grey',
    fontWeight: '500',
  },
  scrollContainer: {
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});
