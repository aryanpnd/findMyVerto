import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import TimetableItem from './TimetableItem';

const { width } = Dimensions.get('screen');

const getCurrentDayIndex = () => {
  const day = new Date().getDay();
  // Treat Sunday (0) as index 0, Monday as 0, Tuesday as 1, etc.
  return day === 0 || day === 7 ? 0 : day - 1;
};

const getHeaderWidths = (headers) => {
  const obj = {};
  headers.forEach((_, i) => {
    obj[i] = useSharedValue(0);
  });
  return obj;
};

export default function TimeTableScreen({ timeTable,courses, classesToday, friend }) {
  // Define day names and build headers with class count.
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const headers = days.map((day, i) => `${day} (${classesToday[i] ?? 0})`);

  const headerWidths = getHeaderWidths(headers);
  const scrollY = useSharedValue(0);
  const topScrollY = useSharedValue(0);
  const bottomScrollRef = useAnimatedRef();
  const topScrollRef = useAnimatedRef();
  // Use a shared value for bottom scroll index.
  const scroll1 = useSharedValue(0);
  const scroll2 = useSharedValue(0);
  // Use local state for the header highlight.
  const [selectedIndex, setSelectedIndex] = useState(getCurrentDayIndex());

  // Update the bottom scroll when scroll1 changes.
  useDerivedValue(() => {
    scrollTo(bottomScrollRef, scroll1.value * width, 0, true);
  });

  // Update the top scroll (indicator) based on scroll2.
  useDerivedValue(() => {
    scrollTo(topScrollRef, scroll2.value, 0, true);
  });

  // Calculate scroll2.value based on scrollY and measured header widths.
  useDerivedValue(() => {
    let sumWidth = 0;
    const input = [];
    const outputWidths = [];
    const outputOffsets = [];
    for (let i = 0; i < headers.length; i++) {
      input.push(width * i);
      const cellWidth = headerWidths[i].value;
      outputWidths.push(cellWidth);
      outputOffsets.push(sumWidth);
      sumWidth += cellWidth;
    }
    const moveValue = interpolate(scrollY.value, input, outputOffsets);
    const barWidth = interpolate(scrollY.value, input, outputWidths);
    scroll2.value = moveValue + barWidth / 2 - width / 2;
  });

  const barWidthStyle = useAnimatedStyle(() => {
    let sumWidth = 0;
    const input = [];
    const outputWidths = [];
    const outputOffsets = [];
    for (let i = 0; i < headers.length; i++) {
      input.push(width * i);
      const cellWidth = headerWidths[i].value;
      outputWidths.push(cellWidth);
      outputOffsets.push(sumWidth);
      sumWidth += cellWidth;
    }
    const moveValue = interpolate(scrollY.value, input, outputOffsets);
    const barWidth = interpolate(scrollY.value, input, outputWidths);
    return {
      width: barWidth,
      transform: [{ translateX: moveValue }],
    };
  });

  const barMovingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -topScrollY.value }],
  }));

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.x;
  });

  const topScrollHandler = useAnimatedScrollHandler(event => {
    topScrollY.value = event.contentOffset.x;
  });

  // Only update scroll index if classesToday has data for the current day.
  useEffect(() => {
    const currentDayIndex = getCurrentDayIndex();
    if (
      Array.isArray(classesToday) &&
      classesToday.length > currentDayIndex &&
      classesToday[currentDayIndex] > 0
    ) {
      setSelectedIndex(currentDayIndex);
      scroll1.value = currentDayIndex;
    }
  }, [classesToday, scroll1]);

  const onPressHeader = index => {
    scroll1.value = index;
  };

  return (
    <View style={styles.flex}>
    <Animated.ScrollView
      ref={topScrollRef}
      style={styles.topScroll}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={topScrollHandler}>
      {headers.map((item, index) => (
        <View
          key={index}
          onLayout={e => {
            headerWidths[index].value = e.nativeEvent.layout.width;
          }}
          style={{ flex: 1 }}>
          <TouchableOpacity style={styles.headerItem} onPress={() => onPressHeader(index)}>
            <Text style={{
              color: getCurrentDayIndex() === index ? "yellow" : "#ffffffb5",
              fontWeight: getCurrentDayIndex() === index ? "bold" : "400",
              fontSize: getCurrentDayIndex() === index ? 16 : 15
            }}>
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </Animated.ScrollView>

    <Animated.View style={[styles.bar, barWidthStyle]} pointerEvents={'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.barInner, barMovingStyle]} />
    </Animated.View>

    <Animated.ScrollView
      ref={bottomScrollRef}
      pagingEnabled
      contentContainerStyle={styles.list}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}>
      {days.map((day, index) => (
        <TimetableItem key={day} index={index} classes={timeTable[day] || []} courses={courses} friend={friend}/>
      ))}
    </Animated.ScrollView>
  </View>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topScroll: {
    flexGrow: 0,
    height: '8%',
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bar: {
    height: 35,
    width: 30,
    top: 4,
    position: 'absolute',
    alignSelf: 'flex-start'
  },
  barInner: {
    marginLeft: 8,
    width: "85%",
    backgroundColor: "#ffffff1a",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20
  },
  list: {
    flexGrow: 1,
  }
});
