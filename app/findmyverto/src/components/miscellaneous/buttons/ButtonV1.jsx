import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../constants/colors';

const ButtonV1 = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  textStyle,
  text,
  bounce = true,
  scaleInValue=0.95,
  opacityEffect = false,
  loading = false,
  disabled = false,
  disabledBackground=colors.disabledBackground,
  spinnerColor = '#fff',
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = e => {
    if (bounce) {
      Animated.spring(scaleAnim, { toValue: scaleInValue, useNativeDriver: true }).start();
    }
    onPressIn?.(e);
  };

  const handlePressOut = e => {
    if (bounce) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.(e);
  };

  const isPressable = !disabled && !loading;

  return (
    <Animated.View 
      style={[
        style, 
        { transform: [{ scale: bounce ? scaleAnim : 1 }] }
      ]}
    >
      <Pressable
        onPress={isPressable ? onPress : null}
        onPressIn={isPressable ? handlePressIn : null}
        onPressOut={isPressable ? handlePressOut : null}
        disabled={!isPressable}
        style={({ pressed }) => [
          styles.button,
          disabled && { backgroundColor: disabledBackground },
          pressed && isPressable && { opacity: opacityEffect ? 0.85 : 1 },
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColor} />
        ) : text ? (
          <Text style={[styles.defaultText, textStyle]}>{text}</Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height:"auto",
        alignItems: 'center',
        justifyContent: 'center',
    },
  disabledButton: {
    backgroundColor: colors.disabledBackground,
  },
  defaultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ButtonV1;