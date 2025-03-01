import { View, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/home/Header';
import Body from '../../components/home/Body';
import { colors } from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import { useNotification } from '../../../context/notification';

export default function Home({ navigation }) {
  const {expoPushToken, notification, error} = useNotification();

  console.log(expoPushToken, notification, error);

  useEffect(() => {
    console.log('expoPushToken', expoPushToken);
  }, [expoPushToken]);

 
  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.secondary }]} >
        <StatusBar style='auto' />
        <View style={styles.container}>
          <Header navigation={navigation} />
          <Body navigation={navigation} />
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
