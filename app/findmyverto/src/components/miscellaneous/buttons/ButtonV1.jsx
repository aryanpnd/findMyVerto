import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

const ButtonV1 = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  textStyle,
  text,
  opacityEffect=false,
  loading = false,
  disabled = false,
  spinnerColor = '#fff',
  ...rest
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event) => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
      onPressIn?.(event);
    }
  };

  const handlePressOut = (event) => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
      onPressOut?.(event);
    }
  };

  const isPressable = !disabled && !loading;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={isPressable ? onPress : null}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isPressable}
        style={({ pressed }) => [
          styles.defaultButton,
          style,
          disabled && styles.disabledButton,
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
  defaultButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  defaultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ButtonV1;
