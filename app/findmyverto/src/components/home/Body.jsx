import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Pressable, Platform, RefreshControl } from 'react-native'
import React, { use, useCallback, useContext, useRef, useState } from 'react'
import HomescreenTimeTable from '../timeTable/HomescreenTimeTable'
import { colors } from '../../constants/colors';
import { AuthContext } from '../../../context/Auth';
import { HEIGHT } from '../../constants/styles';

const { height, width } = Dimensions.get('window');

const navigations = [
  {
    title: "Friends",
    icon: require('../../../assets/icons/friends.png'),
    route: "Friends"
  },
  {
    title: "Timetable",
    icon: require('../../../assets/icons/schedule.png'),
    route: "Timetable"
  },
]

export default function Body({ navigation }) {
  const { auth } = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false);

  // Reference to HomescreenTimeTable component
  const timetableRef = useRef();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Refresh timetable if ref exists
    if (timetableRef.current) {
      await timetableRef.current.handleFetchTimetable()
      timetableRef.current.today()
      timetableRef.current.scrollToOngoing()
    }

    setRefreshing(false);
  }, []);

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
            Password Expires in {auth.passwordExpiry.days} {auth.passwordExpiry.days > 1 ? "days" : "day"}. {"("}{auth.passwordExpiry.updatedAt?.split("T")[0]}{")"}
          </Text>
        </View>

        {/* Classes Today */}
        <View style={styles.classTodayContainer}>
          <HomescreenTimeTable
            ref={timetableRef}
            navigation={navigation}
          />
        </View>

        {/* Other navigations */}
        <View style={styles.NavigationsContainer}>
          {
            navigations.map((value) => (
              <Pressable
                onPress={() => navigation.navigate(value.route)}
                key={value.title} style={styles.NavigationsCard} >
                <Image
                  source={value.icon}
                  style={{ height: width * 0.12, width: width * 0.12 }}
                  transition={1000}
                />
                <Text style={styles.text2}>{value.title}</Text>
              </Pressable>
            ))
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
    // padding: 10,
    backgroundColor: '#ecf0f1',
    // backgroundColor: 'white',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  passwordExpiryContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    padding: 5,
  },
  classTodayContainer: {
    // paddingHorizontal: 20,
    // paddingTop: 20,
    maxHeight: HEIGHT(35),
    marginTop: 15,
    // marginHorizontal: 5,
    borderRadius: 15
  },
  NavigationsContainer: {
    width: "100%",
    padding: 20,
    // paddingTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  NavigationsCard: {
    backgroundColor: "white",
    height: height * 0.14,
    width: width * 0.28,
    borderRadius: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  text1: {
    color: colors.lightDark,
    fontSize: 14,
    fontWeight: '500'
  },

  text2: {
    color: "grey",
    fontSize: 14,
    fontWeight: '500'
  }
})