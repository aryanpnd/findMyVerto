import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL } from '../../../context/Auth'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import { MaterialIcons } from '@expo/vector-icons'


const { height, width } = Dimensions.get('window');

export default function FriendRequests({navigation}) {
  const [loading, setLoading] = useState(false)


  async function searchStudents() {
    
    setLoading(true)
    await axios.post(`${API_URL}/api/student/searchStudents`, { query: query })
      .then(async (result) => {
        
      }).catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Error while searching',
          text2: `${err}`,
        });
        console.log(err);
        setLoading(false)
      })
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      <View style={[styles.header]}>
        {/* Back naviagtion button */}
        <View style={[styles.backBtn]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
          </TouchableOpacity>
        </View>
        {/* title */}
        <View style={[styles.title]}>
          <Text style={{fontSize:18,fontWeight:"500"}}>Requests</Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      height: '100%',
  },

  // header
  header: {
      height: 0.08 * height,
      width: '100%',
      flexDirection: "row",
      padding: 10,
      gap:10
  },
  backBtn: {
      width: "10%",
      justifyContent: "center",
      alignItems: 'center',
  },
  title:{
    alignItems:"center",
    justifyContent:"center"
  },

  // body
  body: {
      height: "92%",
      width: '100%',
      justifyContent: "center",
      alignItems: "center"
  },
  studentsFoundContainer: {
      // backgroundColor:"red",
      width: "100%",
      paddingHorizontal: 20,
      height: height * 0.05,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center"
  },

  // miscellaneous
  text1: { fontSize: 16, textAlign: "center", fontWeight: "500", color: "grey" },
  text2: { fontSize: 18, fontWeight: "500", color: colors.lightDark }
})