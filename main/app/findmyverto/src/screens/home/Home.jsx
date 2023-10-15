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
import { colors } from '../../constants/colors';


export default function Home({navigation}) {
  const { auth, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [userDetails, setuserDetails] = useState({})

  useEffect(() => {
    async function fetchDataLocally() {
      try {
        let user = await AsyncStorage.getItem("USER");
        if (!user) {
          await axios.post(`${API_URL}/api/student/getStudentInfo`, { password: auth.pass }).then(async (result) => {
            await AsyncStorage.setItem("USER", JSON.stringify(result.data))
            setuserDetails(result.data)
            setLoading(false)
            // console.log({ "inside if then": result });
          }).catch((err) => {
            Toast.show({
              type: 'error',
              text1: `${err}`,
            });
            console.log({ "inside catch": err });
            setLoading(false)
          })
          return
        }
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
            <Body logout={logout} navigation={navigation} />
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
    backgroundColor:colors.blue
  },
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },
});
