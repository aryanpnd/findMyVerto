import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const ButtonV1 = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  childrenStyle,
  textStyle,
  text,
  bounce = true,
  scaleInValue = 0.95,
  opacityEffect = false,
  loading = false,
  disabled = false,
  disabledBackground = colors.disabledBackground,
  spinnerColor = '#fff',
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  gradientLocations,
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = e => {
    if (bounce) {
      Animated.timing(scaleAnim, {
        toValue: scaleInValue,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.(e);
  };

  const handlePressOut = e => {
    if (bounce) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.(e);
  };

  const isPressable = !disabled && !loading;

  // Content to render inside the button (loader, text, or children)
  const buttonContent = loading ? (
    <ActivityIndicator color={spinnerColor} />
  ) : text ? (
    <Text style={[styles.defaultText, textStyle]}>{text}</Text>
  ) : (
    children
  );

  // Create the animated component that will be rendered
  const AnimatedComponent = Animated.createAnimatedComponent(gradientColors ? LinearGradient : Animated.View);
  
  // Add gradient props if needed
  const gradientProps = gradientColors ? {
    colors: gradientColors,
    start: gradientStart,
    end: gradientEnd,
    locations: gradientLocations,
  } : {};

  return (
    <AnimatedComponent
      {...gradientProps}
      style={[
        style,
        gradientColors && styles.gradient,
        { transform: [{ scale: bounce ? scaleAnim : 1 }] },
        disabled && gradientColors && { opacity: 0.5 }
      ]}
    >
      <Pressable
        onPress={isPressable ? onPress : null}
        onPressIn={isPressable ? handlePressIn : null}
        onPressOut={isPressable ? handlePressOut : null}
        disabled={!isPressable}
        delayPressIn={bounce ? 80 : 0}
        style={({ pressed }) => [
          styles.button,
          childrenStyle,
          !gradientColors && disabled && { backgroundColor: disabledBackground },
          pressed && isPressable && { opacity: opacityEffect ? 0.6 : 1 },
        ]}
        {...rest}
      >
        {buttonContent}
      </Pressable>
    </AnimatedComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    borderRadius: 8, // Default border radius, can be overridden by style
    overflow: 'hidden',
  },
  defaultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ButtonV1;