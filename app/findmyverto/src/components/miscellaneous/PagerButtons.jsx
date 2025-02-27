import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default function PagerButtons({ buttons, onClick, scrollX, containerWidth, containerHeight }) {
  const [btnContainerWidth, setWidth] = useState(0);
  const btnWidth = btnContainerWidth / buttons?.length;
  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, btnWidth],
  });
  const translateXOpposit = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, -btnWidth],
  });
  return (
    <View
      style={[styles.btnContainer, { width: containerWidth, height: containerHeight }]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {buttons?.map((btn, i) => (
        <TouchableOpacity
          key={btn}
          style={styles.btn}
          onPress={() => onClick(i)}>
          <Text style={{ fontWeight: "500",color:"gray" }}>{btn}</Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.animatedBtnContainer,
          { width: btnWidth, transform: [{ translateX }] },
        ]}>
        {buttons?.map(btn => (
          <Animated.View
            key={btn}
            style={[
              styles.animatedBtn,
              { width: btnWidth, transform: [{ translateX: translateXOpposit }] },
            ]}>
            <Text style={[styles.btnTextActive]}>{btn}</Text>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    // height: "6%",
    borderRadius: 25,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#00000011',
    // width: '90%',
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
    backgroundColor: colors.primary,
  },
  animatedBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
})