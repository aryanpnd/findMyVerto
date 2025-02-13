// MovingGradient.js
import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Wrap LinearGradient so we can animate its props.
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const MovingGradient = ({ colors, style, children }) => {
  // Create an animated value that loops from 0 to 1.
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 4000, // adjust duration as needed
        useNativeDriver: false, // native driver doesn't support non-transform styles
      })
    ).start();
  }, [animation]);

  // Interpolate the animated value to get dynamic start and end positions.
  const animatedStart = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    y: 0,
  };

  const animatedEnd = {
    x: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    y: 0,
  };

  return (
    <AnimatedLinearGradient
      colors={colors}
      start={animatedStart}
      end={animatedEnd}
      style={style}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

export default MovingGradient;
