import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { API_URL, AuthContext } from '../../../context/Auth'
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/home/Header';
import Body from '../../components/home/Body';


export default function Home({navigation}) {
  const { auth, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [userDetails, setuserDetails] = useState({})

  useEffect(() => {
    async function fetchDataLocally() {
      try {
        let user = await AsyncStorage.getItem("USER");
        if (!user) {
          await axios.post(`${API_URL}/api/student/getStudentInfo`, { regNo: auth.regNo, password: auth.pass }).then(async (result) => {
            await AsyncStorage.setItem("USER", JSON.stringify(result.data))
            setuserDetails(result.data)
            setLoading(false)
            // console.log({ "inside if then": result });
          }).catch((err) => {
            Toast.show({
              type: 'error',
              text1: 'Login failed',
              text2: `${err}`,
            });
            console.log({ "inside catch": err });
            setLoading(false)
          })
          return
        }
        console.log({ "ouside if": user });
        setuserDetails(JSON.parse(user))
      } catch (error) {
        console.error(error);
      }
    }
    fetchDataLocally();
  }, []);


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <Header userDetails={userDetails} attendence={10} navigation={navigation}/>
            <Body logout={logout} />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor:'#f78c30'
  },
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    shadowColor: '#52006A',
    elevation: 20,
  },
});
