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


export default function Home({ navigation }) {
  const { auth, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  
  // const { setNotification, removeNotification } = useNotifications();
  // const handleSetNotification = () => {
  //     const taskName = 'dailyReminder';
  //     const content = {
  //       title: 'Daily Reminder',
  //       body: 'This is your daily reminder!',
  //     };
  //     const time = { hour: 3, minute: 55 }; // 9:00 AM

  //     console.log('Setting notification');
  //     setNotification(taskName, content, time);
  //   };

  //   const handleRemoveNotification = () => {
  //     const taskName = 'dailyReminder';
  //     removeNotification(taskName);
  //   };


  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.secondary }]} >
        <StatusBar style='auto' />
        <View style={styles.container}>
          <Header navigation={navigation} />
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
    backgroundColor: colors.primary
  },
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },
});
