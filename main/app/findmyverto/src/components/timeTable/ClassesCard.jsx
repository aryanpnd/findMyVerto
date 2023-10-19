import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { globalStyles } from '../../constants/styles'
import { AppContext } from '../../../context/MainApp'
import { colors } from '../../constants/colors'

export default function ClassesCard({ time, value }) {
  const { courses } = useContext(AppContext)

  return (
    <LinearGradient
      // colors={[colors.blue, colors.blue2]}
      colors={["white", "white"]}
      // colors={['#373b44', '#2c5364']}
      style={[styles.container, globalStyles.elevationMin]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}>

      {/* Class Time */}
      <View style={styles.timeContainer}>
        <Image
          source={require("../../../assets/icons/clock.png")}
          style={{ height: 20, width: 20 }}
          transition={1000}
        />
        <Text style={styles.text2}>{time}</Text>
      </View>

      {/* Rest values */}
      <View style={styles.restValues}>
        {/* Course name and code  */}
        <View>
          <Text style={styles.text1}>
            {"("}{value?.split("/")[1].split(" ")[2].split(":")[1]}{")"}  {courses[value?.split("/")[1].split(" ")[2].split(":")[1]]}
          </Text>
        </View>

        <View style={styles.buildingAndGroupContainer}>
          <View style={styles.btnEffect}>
            <Image
              source={require("../../../assets/icons/building.png")}
              style={{ height: 20, width: 20 }}
              transition={1000}
            />
            <Text style={styles.text2}>{value?.split("/")[2]?.split(":")[1]}</Text>
          </View>

          <View style={styles.btnEffect}>
            <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} />
            <Text style={styles.text2}>Group: {value?.split("/")[1]?.split(" ")[1]?.split(":")[1]}</Text>
          </View>
        </View>

      </View>


    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 360,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    gap: 10
  },
  timeContainer: {
    borderWidth: 1,
    borderColor: '#c31432',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    gap: 10
  },
  restValues: {
    // backgroundColor:'red',
    justifyContent: 'space-between',
    width: '70%',
    padding: 2
  },
  buildingAndGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnEffect: {
    padding: 5,
    backgroundColor: colors.btn1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  },
  text1: {
    color: "grey",
    fontSize: 14,
    fontWeight: 'bold'
  },
  text2: {
    // color: 'white',
    color: "grey",
  }
})