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
import trimEmptySlots from '../../constants/trimEmptySlots';
import ClassesCard from './ClassesCard';
import BreakCard from './BreakCard';
import { colors } from '../../constants/colors';
import { globalStyles } from '../../constants/styles';
const { width } = Dimensions.get('screen');
import getDay from '../../constants/getDay';

const headers = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getHeaderWidths = () => {
  const obj = {};
  headers.forEach((x, i) => {
    obj[i] = useSharedValue(0);
  });
  return obj;
};

export default function TimeTableScreen({ timeTable }) {
  const [day, setDay] = useState(0)

  useEffect(() => {
    getDay(setDay)
  }, [])


  //store each tab widths
  const headerWidths = getHeaderWidths();

  //scroll values of both Scrollview
  const scrollY = useSharedValue(0);
  const topScrollY = useSharedValue(0);

  //values to handle auto scroll of bottom ScrollView
  const bottomScrollRef = useAnimatedRef();
  const scroll1 = useSharedValue(0);
  useDerivedValue(() => {
    scrollTo(bottomScrollRef, scroll1.value * width, 0, true);
  });

  //values to handle auto scroll of top ScrollView
  const topScrollRef = useAnimatedRef();
  const scroll2 = useSharedValue(0);
  useDerivedValue(() => {
    scrollTo(topScrollRef, scroll2.value, 0, true);
  });

  // listener to store scroll value of bottom ScrollView
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.x;
  });

  // listener to store scroll value of top ScrollView
  const topScrollHandler = useAnimatedScrollHandler(event => {
    topScrollY.value = event.contentOffset.x;
  });

  // generate dynamic width of moving bar
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
    // next line handle auto scroll of top ScrollView
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

  // generate dynamic translateX of moving bar
  const barMovingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -topScrollY.value }],
  }));

  const onPressHeader = index => {
    // next line handle auto scroll of bottom ScrollView
    scroll1.value = index;
  };

  return (
    <View style={styles.flex}>

      {/* header tabs */}
      <Animated.ScrollView style={[styles.topScroll]}
        contentContainerStyle={styles.topScroll2}
        ref={topScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={topScrollHandler}>

        {headers.map((item, index) => (
          <View
            onLayout={e =>
              (headerWidths[index].value = e.nativeEvent.layout.width)
            }
            key={item}
            style={{ flex: index === 1 ? 2 : 1 }}>
            <TouchableOpacity
              style={[styles.headerItem]}
              onPress={() => onPressHeader(index)}>
              <Text style={{ color: day-1 == index ?"yellow":"#ffffffb5",fontWeight: day-1 == index ?"bold":"400",fontSize: day-1 == index ?16:15}}>{item}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>

      {/* header scrolling bar */}
      <Animated.View style={[styles.bar, barWidthStyle]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.barInner, barMovingStyle]}
        >
        </Animated.View>
      </Animated.View>

      {/* Timetable body */}
      <Animated.ScrollView contentContainerStyle={styles.list}
        ref={bottomScrollRef}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}>
        {headers.map((item, index) => (
          <Item index={index} key={item} timeTable={timeTable[index]} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function Item({ index, timeTable }) {
  const [timeTableOfday, setTimeTableOfday] = useState({})
  const [timeTableOfdayTrimed, setTimeTableOfdayTrimed] = useState({})

  useEffect(() => {
    if (timeTable && timeTable.length > 0) {
      setTimeTableOfday(timeTable[1])
    }
  }, [timeTable])

  useEffect(() => {
    Object.keys(timeTableOfday).map((value, index) => {
      setTimeTableOfdayTrimed(trimEmptySlots(timeTableOfday))
    })
  }, [timeTableOfday])

  return (
    <>
      {
        <Animated.View style={styles.itemContainer}>
          <View style={[styles.items]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 10, paddingHorizontal: 8 }}>
              {
                Object.keys(timeTableOfdayTrimed).reverse().map((value, index) => (
                  timeTableOfdayTrimed[value].length > 1 ?
                    (<ClassesCard key={index} time={value} value={timeTableOfdayTrimed[value]} />)
                    :
                    (<BreakCard key={index} time={value} />)
                ))

              }
            </ScrollView>
          </View>
        </Animated.View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'space-between'
  },
  topScroll: {
    flexGrow: 0,
    height: '8%',
    backgroundColor: colors.blue2,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topScroll2: {
    // alignItems:"center"
  },
  headerItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bar: {
    height: 35,
    width: 25,
    top: 4,
    position: 'absolute',
    alignSelf: 'flex-start',
  },
  barInner: {
    marginLeft: 8,
    width: "80%",
    backgroundColor: "#ffffff1a",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20
  },
  list: {
    // height:"88%",
    justifyContent: 'center',
    alignItems: "center"
  },
  itemContainer: {
    height: '100%',
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  items: {
    height: "100%",
    width: "100%",
    alignItems: 'center',
    // backgroundColor:'red'
  }
  ,

  txt: {
    fontSize: 30,
    color: '#fff',
  },
});