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
import { StatusBar } from 'expo-status-bar';
import useNotifications from '../../../hooks/useNotifications';


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
            await AsyncStorage.setItem("USER", JSON.stringify(result.data.data))
            setuserDetails(result.data.data)
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

  const { setNotification, removeNotification } = useNotifications();
  const handleSetNotification = () => {
      const taskName = 'dailyReminder';
      const content = {
        title: 'Daily Reminder',
        body: 'This is your daily reminder!',
      };
      const time = { hour: 3, minute: 55 }; // 9:00 AM
      
      console.log('Setting notification');
      setNotification(taskName, content, time);
    };
  
    const handleRemoveNotification = () => {
      const taskName = 'dailyReminder';
      removeNotification(taskName);
    };


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={[styles.container,{backgroundColor:'transparent'}]} >
      <StatusBar style='auto'/>
        <View style={styles.container}>
          {/* <Text>hi</Text> */}
            <Header userDetails={userDetails} attendence={10} navigation={navigation}/>
            {/* <TouchableOpacity onPress={() => handleSetNotification()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ color: 'black' }}>Start the notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveNotification()} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ color: 'black' }}>End the notification</Text>
            </TouchableOpacity> */}
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
    backgroundColor:colors.primary
  },
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },
});
