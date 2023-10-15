import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import SyncData from '../miscellaneous/SyncData'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import LottieView from 'lottie-react-native';
import { colors } from '../../constants/colors';


export default function Body({navigation}) {
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
      <ScrollView>

        {/* Classes Today */}
        <View style={styles.classTodayContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={styles.text1}>Classes today: {classesToday}</Text>
            <TouchableOpacity style={{flexDirection:'row',gap:5,backgroundColor:colors.btn1,paddingHorizontal:15,borderRadius:10}} onPress={()=>navigation.navigate('Timetable')}>
              <Text style={{fontSize:12,color:'#757272b5'}}>View Timetable</Text>
            </TouchableOpacity>
          </View>
          {
            day === 0 ?
              <View style={{ alignItems: "center", justifyContent: "center" }}>
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
              <HomescreenTimeTable setClassesToday={setClassesToday} />
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
    height: 230,
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