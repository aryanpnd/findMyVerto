import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { API_URL, AuthContext } from '../../../context/Auth'
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Front() {
  const { auth, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [userDetails, setuserDetails] = useState({})

  useEffect(() => {
    async function fetchDataLocally() {
      // try {
        let user = await AsyncStorage.getItem("USER");
        if (!user) {
          // await axios.post(`${API_URL}/api/student/getStudentInfo`, { regNo: auth.regNo, password: auth.pass }).then(async (result) => {
          //   await AsyncStorage.setItem("USER", JSON.stringify(result.data))
          //   setuserDetails(result.data)
          //   setLoading(false)
          //   console.log({"inside if then":result});
          // }).catch((err) => {
          //   Toast.show({
          //     type: 'error',
          //     text1: 'Login failed',
          //     text2: `${err}`,
          //   });
          //   console.log({"inside catch":err});
          //   setLoading(false)
          // })
          headers= { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMjAzOTg3LCJpYXQiOjE2OTYyMjk4MjN9.DJsrfFW2498KU1oU0fe1liGJgN2RiPBATM43xd8L0_Y' }
          const user = { regNo: auth.regNo, password: auth.pass };
          const data  = await axios.post(`${API_URL}/api/student/getStudentInfo`, user,{headers})
          console.log(user);
          console.log(config);
          console.log(data);
          return
        }
        console.log({ "ouside if": user });
        setuserDetails(JSON.parse(user))
      // } catch (error) {
      //   console.error(error);
      // }
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
          <Text>{userDetails.name}</Text>
          <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 6,
  },
  loginContainer: {
    flex: 4,
    height: '100%',
    width: '100%'
  },
  keyboardContainer: {
    flex: 7,
    padding: 10,
  },
  input: {
    height: 65,
    padding: 10,
    borderColor: 'black',
    marginBottom: 30,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 20
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
