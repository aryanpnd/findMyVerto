import { View, Text, StyleSheet, Image } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { globalStyles } from '../../constants/styles'
import { colors } from '../../constants/colors'
import isTimeEqual from '../../utils/helperFunctions/funtions'
import { getDay } from '../../utils/helperFunctions/dataAndTimeHelpers'

export default function ClassesCard({ time, classes, day }) {
  const [ongoing, setOngoing] = useState(false)

  const checkOngoing = () => {
    const isOngoing = isTimeEqual(time) && day === getDay()
    setOngoing(isOngoing)
  }
  useEffect(() => {
    checkOngoing()    
  }, [classes])

  return (
    <LinearGradient
      // colors={[colors.blue, colors.secondary]}
      colors={["white", "white"]}
      // colors={['#373b44', '#2c5364']}
      style={[styles.container, globalStyles.elevationMin]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}>

      {/* Class Time */}
      <LinearGradient colors={ongoing ? ['#a8e063', '#56ab2f'] : ["white", "white"]}
        style={[styles.timeContainer, ongoing && { borderWidth: 0 }]}
      >
        <Image
          source={require("../../../assets/icons/clock.png")}
          style={{ height: 20, width: 20 }}
          transition={1000}
        />
        <Text style={[styles.text2, ongoing && { color: "white" }]}>{time}</Text>
        {ongoing && <Text style={{ color: "white", fontWeight: 'bold' }}>Ongoing</Text>}
      </LinearGradient>

      <View style={styles.classesContainer}>
        {
          classes?.map((classDetail, index) => (
            <View style={styles.classValues} key={index}>
              {/* Course name and code  */}
              <View>
                <Text style={styles.text1}>
                  {classDetail.class} - {classDetail.className}
                </Text>
              </View>

              <View style={styles.classInfoContainer}>
                <View style={styles.btnEffect}>
                  <Image
                    source={require("../../../assets/icons/building.png")}
                    style={{ height: 20, width: 20 }}
                    transition={1000}
                  />
                  <Text style={styles.text2}>{classDetail.room}</Text>
                </View>

                <View style={styles.btnEffect}>
                  <Image
                    source={require("../../../assets/icons/section.png")}
                    style={{ height: 20, width: 20 }}
                    transition={1000}
                  />
                  <Text style={styles.text2}>{classDetail.section}</Text>
                </View>
              </View>
              <View style={styles.classInfoContainer}>

                <View style={styles.btnEffect}>
                  {/* <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} /> */}
                  <Text style={styles.text2}>Group: {classDetail.group}</Text>
                </View>

                <View style={styles.btnEffect}>
                  {/* <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} /> */}
                  <Text style={styles.text2}>Type: {classDetail.type}</Text>
                </View>
              </View>
              {classes.length > 1 && index !== classes.length - 1 && <View style={styles.divider}></View>}
            </View>
          ))
        }

      </View>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // height: 100,
    // width: 360,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    // gap: 5
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
  classesContainer: {
    // backgroundColor:'red',
    justifyContent: 'space-between',
    width: '75%',
    // padding: 2,
    gap: 10
  },
  classValues: {
    // backgroundColor:'red',
    justifyContent: 'space-between',
    // width: '100%',
    padding: 2,
    gap: 10
  },
  classInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnEffect: {
    padding: 5,
    backgroundColor: colors.btn1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  text1: {
    color: "grey",
    fontSize: 14,
    fontWeight: 'bold'
  },
  text2: {
    // color: 'white',
    color: "grey",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: colors.disabledBackground,
    marginVertical: 5,
    alignSelf: "center"
  }
})