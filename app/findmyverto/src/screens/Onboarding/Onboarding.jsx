import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView
} from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { HEIGHT, WIDTH } from '../../constants/styles';
import AwesomeButton from "react-native-really-awesome-button";
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');
const SLIDE_DURATION = 4000; // 4 seconds per slide

const slides = [
  {
    key: '1',
    title: 'Welcome to FindMyVerto',
    description: 'Discover your all-in-one academic & social companion designed exclusively for LPU students. 🎓',
    image: require('../../../assets/illustrations/welcome-students.png'),
  },
  {
    key: '2',
    title: 'Your Academic Hub',
    description: 'Access timetables, attendance, grades, and assignments—all in one seamless dashboard. 📅',
    image: require('../../../assets/illustrations/welcome-students.png'),
  },
  {
    key: '3',
    title: 'Stay Updated',
    description: 'Get real-time notifications and reminders so you never miss a class or deadline. ⏰',
    image: require('../../../assets/illustrations/welcome-students.png'),
  },
  {
    key: '4',
    title: 'Connect & Collaborate',
    description: 'Easily find and connect with friends to share your academic journey. 🤝',
    image: require('../../../assets/illustrations/welcome-students.png'),
  },
];


export default function OnboardingScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const currentIndex = useRef(0);
  const progressAnimations = useRef(
    slides.map(() => new Animated.Value(0))
  ).current;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Reset and start progress animation for current slide
    const startProgressAnimation = () => {
      Animated.timing(progressAnimations[currentIndex.current], {
        toValue: 1,
        duration: SLIDE_DURATION,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // Move to next slide when animation completes
          if (currentIndex.current < slides.length - 1) {
            currentIndex.current += 1;
          } else {
            currentIndex.current = 0;
          }

          // Reset all progress animations
          progressAnimations.forEach(anim => {
            anim.setValue(0);
          });

          // Scroll to next slide
          scrollViewRef.current?.scrollTo({
            x: currentIndex.current * width,
            animated: true
          });

          // Update active index
          setActiveIndex(currentIndex.current);

          // Restart progress animation
          startProgressAnimation();
        }
      });
    };

    // Initial start of progress animation
    startProgressAnimation();

    return () => {
      // Stop all animations on unmount
      progressAnimations.forEach(anim => anim.stopAnimation());
    };
  }, []);

  const renderSlides = () => {
    return slides.map((slide) => (
      <View key={slide.key} style={styles.slide}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    ));
  };

  const renderDots = () => {
    return slides.map((_, index) => {
      const isActive = index === activeIndex;

      return (
        <View key={index} style={styles.dotContainer}>
          <View style={[styles.dotBackground, { width: isActive ? 30 : 10 }]}>
            <Animated.View
              style={[
                styles.dotFill,
                {
                  width: progressAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.5)'
                }
              ]}
            />
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={{ color: "white", fontSize: 35, fontWeight: 'bold', textAlign: 'center'}}>Find My Verto</Text>
      </View>

      <View style={styles.body}>
        <Image source={require('../../../assets/illustrations/welcome-students.png')} style={styles.image} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {renderSlides()}
        </ScrollView>
        <View style={styles.dotsContainer}>{renderDots()}</View>
      </View>

      <AwesomeButton
        width={WIDTH(90)}
        height={HEIGHT(7)}
        borderRadius={30}
        raiseLevel={4}
        backgroundColor="white"
        backgroundDarker={colors.whiteLight}
        debouncedPressTime={200}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </AwesomeButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHT(5),
  },
  header: {
    width: WIDTH(100),
    height: HEIGHT(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: WIDTH(100),
    height: HEIGHT(70),
    justifyContent: 'space-between',
  },
  image: {
    width: WIDTH(100),
    height: "60%",
    objectFit: 'fill',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '500',
    color: "white",
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: colors.whiteLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    height: "5%",
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotContainer: {
    marginHorizontal: 5,
  },
  dotBackground: {
    width: 30,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  dotFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
