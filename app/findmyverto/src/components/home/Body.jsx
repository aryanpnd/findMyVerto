import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, TouchableHighlight, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import SyncData from '../miscellaneous/SyncData'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import { colors } from '../../constants/colors';
import isTimeEqual from '../../constants/funtions';
import getDay from '../../constants/getDay';


const { height, width } = Dimensions.get('window');

const navigations = [
  {
    title: "Friends",
    icon: require('../../../assets/icons/friends.png'),
    route: "Friends"
  },
  {
    title: "Timetable",
    icon: require('../../../assets/icons/schedule.png'),
    route: "Timetable"
  },
]

const days  = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Body({ navigation }) {
  const [classesToday, setClassesToday] = useState(0)
  const [timeTable, settimeTable] = useState([])
  const [day, setDay] = useState(0)

  function today() {
    const td = new Date()
    setDay(td.getDay())
  }
  useEffect(() => {
    today()
  }, [])
  

  return (
    <View style={styles.body}>

      {/* Classes Today */}
      <View style={styles.classTodayContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={styles.text1}>
            <Text style={{color:"grey"}}>Classes today:</Text> {timeTable && timeTable.length > 0 && isTimeEqual(timeTable[timeTable.length - 1][0], true) ?"Over":classesToday}
            </Text>
          {timeTable.length == 0 ?
            <></> :
            <Text style={styles.text1}>
              {days[day]}
            </Text>
          }

        </View>
        <HomescreenTimeTable navigation={navigation} setClassesToday={setClassesToday} timeTable={timeTable} settimeTable={settimeTable} today={today} />

      </View>

      {/* Other navigations */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.NavigationsContainer}>
          {
            navigations.map((value) => (
              <Pressable
                onPress={() => navigation.navigate(value.route)}
                key={value.title} style={styles.NavigationsCard} >
                <Image
                  source={value.icon}
                  style={{ height: width*0.12, width: width*0.12 }}
                  transition={1000}
                />
                <Text style={styles.text2}>{value.title}</Text>
              </Pressable>
            ))
          }
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
    padding: 10,
    height: height * 0.30,
    marginTop: 15,
    // marginHorizontal: 5,
    borderRadius: 15
  },
  NavigationsContainer: {
    // backgroundColor: "yellow",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  NavigationsCard: {
    backgroundColor: "white",
    height: height * 0.14,
    width: width * 0.28,
    borderRadius: 20,
    justifyContent:"space-evenly",
    alignItems:"center",
  },

  text1: {
    color: colors.lightDark,
    fontSize: 14,
    fontWeight: '500'
  },

  text2: {
    color: "grey",
    fontSize: 14,
    fontWeight: '500'
  }
})