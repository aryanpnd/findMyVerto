import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native';
import { globalStyles } from '../../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';
import isTimeEqual from '../../utils/helperFunctions/funtions';
import { getDay } from '../../utils/helperFunctions/dataAndTimeHelpers';


export default function BreakCard({ time, day }) {
  const [ongoing, setOngoing] = useState(false)

  const checkOngoing = () => {
    const isOngoing = isTimeEqual(time) && getDay() && day === getDay()
    setOngoing(isOngoing)
  }
  useEffect(() => {
    checkOngoing()
  }, [time])
  return (

    <LinearGradient
      colors={['#a8e063', '#56ab2f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }} style={[styles.container, globalStyles.elevationMin]}>
      <LottieView
        autoPlay
        style={{
          width: 90,
          height: 90,
          backgroundColor: "white",
        }}
        source={require('../../../assets/lotties/breaktime.json')}
      />
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "white" }}>{time}</Text>
        {ongoing && <Text style={{ fontSize: 20, fontWeight: 'bold', color: "white",textAlign:"center" }}>Ongoing</Text>}
      </View>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center'
  }
})