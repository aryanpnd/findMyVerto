import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  Platform,
  RefreshControl,
  Button
} from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import { colors } from '../../constants/colors'
import { AuthContext } from '../../../context/Auth'
import { HEIGHT, WIDTH } from '../../constants/styles'
import { homeScreenNavigations } from '../../constants/globalConstants'
import notifee, { AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const { width } = Dimensions.get('window')

export default function Body({ navigation }) {
  const { auth } = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false)

  // Reference to HomescreenTimeTable component
  const timetableRef = useRef()

  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    // Refresh timetable if ref exists
    if (timetableRef.current) {
      await timetableRef.current.handleFetchTimetable()
      timetableRef.current.today()
      timetableRef.current.scrollToOngoing()
    }

    setRefreshing(false)
  }, [])

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture: 'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960'
        },
        largeIcon: 'https://res.cloudinary.com/dnm7sr6om/image/upload/v1740857118/students/12203987.jpg',
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  async function cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  const [fcmToken, setFcmToken] = useState('');
  async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      setFcmToken(fcmToken);
      // Send the token to your server for later use
    } else {
      console.log('Failed to get FCM token');
    }
  }

  return (
    <View style={styles.body}>
      <Pressable>
      </Pressable>
      <Button title="Display Notification" onPress={onDisplayNotification} />
      <Button title="Cancel All Notifications" onPress={cancelAllNotifications} />
      <Button title="Get FCM Token" onPress={getFcmToken} />
        <Text style={styles.text1} selectable={true}>{fcmToken}</Text>
      <ScrollView
        style={styles.body}
        bounces={Platform.OS === 'ios' ? true : undefined}
        alwaysBounceVertical={true}
        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.secondary}
            colors={[colors.secondary]}
          />
        }
      >
        <View style={styles.passwordExpiryContainer}>
          <Text style={styles.text2}>
            Password Expires in {auth.passwordExpiry.days}{' '}
            {auth.passwordExpiry.days > 1 ? 'days' : 'day'}. (
            {auth.passwordExpiry.updatedAt?.split('T')[0]})
          </Text>
        </View>

        {/* Classes Today */}
        <View style={styles.classTodayContainer}>
          <HomescreenTimeTable ref={timetableRef} navigation={navigation} />
        </View>

        {/* Other navigations in a 3x3 grid */}
        <View style={styles.NavigationsContainer}>
          {homeScreenNavigations.map((value) => (
            <Pressable
              onPress={() => navigation.navigate(value.route)}
              key={value.title}
              style={[styles.NavigationsCard, value.development && { opacity: 0.6 }]}
            >
              {/* {value.development&&
              <View style={styles.underDevelopmentMark}>
                <Text>Development</Text>
                </View>} */}
              <Image
                source={value.icon}
                style={{
                  height: width * 0.12,
                  width: width * 0.12,
                  resizeMode: 'contain'
                }}
                transition={1000}
              />
              <Text style={styles.text2}>{value.title}</Text>
            </Pressable>
          ))}
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
    backgroundColor: '#ecf0f1',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45
  },
  passwordExpiryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    padding: 5
  },
  classTodayContainer: {
    maxHeight: HEIGHT(35),
    marginTop: 15,
    borderRadius: 15
  },
  NavigationsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // backgroundColor:"red"
  },
  // Each card takes roughly 30% of the width, ensuring 3 cards per row.
  // The "aspectRatio: 1" makes each card square.
  NavigationsCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  text1: {
    color: colors.lightDark,
    fontSize: 14,
    fontWeight: '500'
  },
  text2: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  }
})
