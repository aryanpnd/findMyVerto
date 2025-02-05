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
import BreakCard from '../timeTable/BreakCard';
import ClassesCard from '../timeTable/ClassesCard';
import { getDay } from '../../../utils/helperFunctions/dataAndTimeHelpers';
import LottieView from 'lottie-react-native';
import isTimeEqual from '../../../utils/helperFunctions/funtions';
import TimetableScreenShimmer from '../shimmers/TimetableScreenShimmer';

const { width } = Dimensions.get('screen');

const headers = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getCurrentDayIndex = () => {
  const day = new Date().getDay();
  return day === 0 || day === 7 ? 0 : day - 1;
};

const getHeaderWidths = () => {
  const obj = {};
  headers.forEach((x, i) => {
    obj[i] = useSharedValue(0);
  });
  return obj;
};

export default function TimeTableScreen({ timeTable }) {
  const [loading, setLoading] = useState(true);
  const headerWidths = getHeaderWidths();
  const scrollY = useSharedValue(0);
  const topScrollY = useSharedValue(0);

  const bottomScrollRef = useAnimatedRef();
  const scroll1 = useSharedValue(getCurrentDayIndex());
  useDerivedValue(() => {
    scrollTo(bottomScrollRef, scroll1.value * width, 0, true);
  });

  const topScrollRef = useAnimatedRef();
  const scroll2 = useSharedValue(0);
  useDerivedValue(() => {
    scrollTo(topScrollRef, scroll2.value, 0, true);
  });

  useEffect(() => {
    scroll1.value = getCurrentDayIndex();
  }, []);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.x;
  });

  const topScrollHandler = useAnimatedScrollHandler(event => {
    topScrollY.value = event.contentOffset.x;
  });

  const barWidthStyle = useAnimatedStyle(() => {
    const input = [];
    const output1 = [];
    const output2 = [];
    let sumWidth = 0;
    const keys = Object.keys(headerWidths);
    keys.map((key, index) => {
      input.push(width * index);
      const cellWidth = headerWidths[key].value;
      output1.push(cellWidth);
      output2.push(sumWidth);
      sumWidth += cellWidth;
    });
    const moveValue = interpolate(scrollY.value, input, output2);
    const barWidth = interpolate(scrollY.value, input, output1);
    scroll2.value = moveValue + barWidth / 2 - width / 2;
    return {
      width: barWidth,
      transform: [
        {
          translateX: moveValue,
        },
      ],
    };
  });

  const barMovingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -topScrollY.value }],
  }));

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
            onLayout={e =>
              (headerWidths[index].value = e.nativeEvent.layout.width)
            }
            key={item}
            style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.headerItem]}
              onPress={() => onPressHeader(index)}>
              <Text style={{ color: scroll1.value == index ? "yellow" : "#ffffffb5", fontWeight: scroll1.value == index ? "bold" : "400", fontSize: scroll1.value == index ? 16 : 15 }}>{item}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>

      <Animated.View style={[styles.bar, barWidthStyle]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.barInner, barMovingStyle]}
        />
      </Animated.View>


      <Animated.ScrollView
        ref={bottomScrollRef}
        pagingEnabled
        contentContainerStyle={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}>
        {
          headers.map((item, index) => (
            <Item index={index} key={item} classes={timeTable[headers[index]] || []} />
          ))
        }
      </Animated.ScrollView>

    </View>
  );
}

function Item({ classes, index }) {
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    // Find index of the ongoing class
    const ongoingIndex = classes.findIndex(classDetails =>
      isTimeEqual(classDetails?.time) && getDay() === index
    );

    if (ongoingIndex !== -1 && scrollViewRef.current) {
      // Scroll to the ongoing class
      scrollViewRef.current.scrollTo({
        y: ongoingIndex * 100, // Assuming each card has a height of ~100px, adjust accordingly
        animated: true,
      });
    }
  }, [classes]);

  return (
    <Animated.View style={styles.itemContainer}>
      <View style={[styles.items]}>
        {!classes[0]?.time ? (
          <View style={{ alignItems: "center", justifyContent: "center", gap: 8, width: width, height: "100%" }}>
            <LottieView
              autoPlay
              style={{
                width: 200,
                height: 200,
              }}
              source={require('../../../assets/lotties/sleep.json')}
            />
            <Text style={styles.text1}>No classes for today</Text>
            <Text style={styles.text1}>Have fun...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 10, paddingHorizontal: 8 }}
          >
            {classes.map((classDetails, idx) =>
              classDetails?.break ? (
                <BreakCard key={idx} time={classDetails?.time} day={index} />
              ) : (
                <ClassesCard key={idx} time={classDetails?.time} classes={classDetails?.class} day={index} />
              )
            )}
          </ScrollView>
        )}
      </View>
    </Animated.View>
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
  itemContainer: {
    height: '100%',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  items: {
    height: "100%",
    width: "100%",
    // alignItems: 'center',
  },
  headerItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeHeader: {
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  bar: {
    height: 35,
    width: 25,
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
  txt: {
    fontSize: 30,
    color: '#fff',
  },
  text1: {
    color: "grey",
    fontWeight: "500"
  }
});
