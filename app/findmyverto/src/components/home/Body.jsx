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
} from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import { colors } from '../../constants/colors'
import { AuthContext } from '../../../context/Auth'
import { HEIGHT, WIDTH } from '../../constants/styles'
import { homeScreenNavigations } from '../../constants/globalConstants'
import ButtonV1 from '../miscellaneous/buttons/ButtonV1'

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

  return (
    <View style={styles.body}>
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
            <ButtonV1
              key={value.title}
              style={[styles.NavigationsCard, value.development && { opacity: 0.6 }]}
              childrenStyle={{justifyContent: 'center', alignItems: 'center'}}
              scaleInValue={0.90}
              onPress={() => navigation.navigate(value.route)}
            >
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
            </ButtonV1>
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
    // padding: 10,
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
