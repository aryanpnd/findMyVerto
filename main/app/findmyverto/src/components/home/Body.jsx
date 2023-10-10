import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import SyncData from '../miscellaneous/SyncData'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'

export default function Body() {
  return (
    <View style={styles.body}>
      <SyncData />
      <ScrollView>
        <View style={styles.classTodayContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={styles.text1}>Classes today</Text>
            <TouchableOpacity>
              <Text style={styles.text1}>View Timetable</Text>
            </TouchableOpacity>
          </View>
          <HomescreenTimeTable />
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
    fontSize: 14,
    fontWeight: '500'
  }
})