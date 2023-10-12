import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SyncData from '../miscellaneous/SyncData'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import LottieView from 'lottie-react-native';


export default function Body() {
  const [classesToday, setClassesToday] = useState(0)
  const [day, setDay] = useState(0)
  function getDay() {
    const currentDate = new Date();
    setDay(currentDate.getDay())
  }
  useEffect(() => {
    getDay()
  }, [])
  
  return (
    <View style={styles.body}>
      <SyncData />
      <ScrollView>
        <View style={styles.classTodayContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={styles.text1}>Classes today: {classesToday}</Text>
            <TouchableOpacity>
              <Text >View Timetable</Text>
            </TouchableOpacity>
          </View>
          {
            day===0?
            <View style={{alignItems:"center",justifyContent:"center"}}>
            <LottieView
                autoPlay
                style={{
                  width: 100,
                  height: 100,
                }}
                source={require('../../../assets/lotties/sloth.json')}
                />
                <Text style={styles.text1}>It's Sunday, No classes Today</Text>
                </View>
                :
          <HomescreenTimeTable setClassesToday={setClassesToday}/>
          }
        </View>

        <View style={styles.classTodayContainer}>
          <Text>Classes today</Text>
        </View>
        <View style={styles.classTodayContainer}>
          <Text>Classes today</Text>
        </View>
        <View style={styles.classTodayContainer}>
          <Text>Classes today</Text>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 5,
    width: '100%',
    height: '100%',
    padding: 10,
    backgroundColor: '#ecf0f1',
    // backgroundColor: 'white',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  classTodayContainer: {
    // backgroundColor: 'red',
    padding: 8,
    height: 200,
    marginTop: 15,
    // marginHorizontal: 5,
    borderRadius: 15
  },
  text1: {
    color: "#2d3436",
    fontSize: 15,
    fontWeight: 'bold'
  }
})