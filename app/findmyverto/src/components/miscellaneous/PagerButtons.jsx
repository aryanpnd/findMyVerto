import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export default function PagerButtons({ buttons, onClick, scrollX, containerWidth, containerHeight, pageWidth, buttonColor }) {
  const [btnContainerWidth, setWidth] = useState(0);
  // Calculate each button's width
  const btnWidth = btnContainerWidth / buttons?.length;

  // Use the passed pageWidth to set the interpolation input range.
  // When scrolling from 0 to (pageWidth * (buttons.length - 1)),
  // the indicator should translate from 0 to (btnWidth * (buttons.length - 1)).
  const translateX = scrollX.interpolate({
    inputRange: [0, pageWidth * (buttons.length - 1)],
    outputRange: [0, btnWidth * (buttons.length - 1)],
    extrapolate: 'clamp'
  });

  // This inverse translation ensures the text inside the animated indicator remains centered.
  const translateXOpposit = scrollX.interpolate({
    inputRange: [0, pageWidth * (buttons.length - 1)],
    outputRange: [0, -btnWidth * (buttons.length - 1)],
    extrapolate: 'clamp'
  });

  return (
    <View
      style={[styles.btnContainer, { width: containerWidth, height: containerHeight }]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {buttons?.map((btn, i) => (
        <TouchableOpacity
          key={btn}
          style={styles.btn}
          onPress={() => onClick(i)}
        >
          <Text style={{ fontWeight: "500", color: "gray" }}>{btn}</Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.animatedBtnContainer,
          { backgroundColor: buttonColor || colors.primary, width: btnWidth, transform: [{ translateX }] },
        ]}
      >
        {buttons?.map(btn => (
          <Animated.View
            key={btn}
            style={[
              styles.animatedBtn,
              { width: btnWidth, transform: [{ translateX: translateXOpposit }] },
            ]}
          >
            <Text style={styles.btnTextActive}>{btn}</Text>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#00000011',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBtnContainer: {
    borderRadius: 25,
    height: "100%",
    flexDirection: 'row',
    position: 'absolute',
    alignItems: "center",
    overflow: 'hidden',
  },
  animatedBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
