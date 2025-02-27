import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import Toast from 'react-native-toast-message'
import { API_URL, AuthContext } from '../../../context/Auth'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import { MaterialIcons } from '@expo/vector-icons'
import SearchedStudentCard from '../../components/vertoSearch/SearchedStudentCard'
import LottieView from 'lottie-react-native';
import EmptyRequests from '../../components/miscellaneous/EmptyRequests'
import { getFriendRequests, getSentFriendRequests } from '../../../utils/fetchUtils/handleFriends/handleFriends'
import PagerButtons from '../../components/miscellaneous/PagerButtons'
import { HEIGHT, WIDTH } from '../../constants/styles'

const { height, width } = Dimensions.get('window');

export default function FriendRequests({ navigation }) {
  const { auth } = useContext(AuthContext)

  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const buttons = ['Requests', 'Sent requests'];
  const onCLick = i => scrollViewRef.current?.scrollTo({ x: i * width });

  const [friends, setfriends] = useState([])
  const [friendsRequests, setfriendsRequests] = useState([])
  const [sentFriendRequests, setSentFriendRequests] = useState([])
  const [disableBtn, setDisableBtn] = useState(false)

  const [loading, setLoading] = useState(false)


  function handleGetFriendRequests() {
    getFriendRequests(auth, setfriendsRequests, setLoading)
  }
  function handleGetSentRequests() {
    getSentFriendRequests(auth, setSentFriendRequests, setLoading)
  }

  useEffect(() => {
    handleGetFriendRequests()
    handleGetSentRequests()
  }, [])

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
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Requests</Text>
        </View>
      </View>

      <View style={styles.body}>
        <PagerButtons buttons={buttons} onClick={onCLick} scrollX={scrollX} containerWidth={WIDTH(90)} containerHeight={HEIGHT(6)}/>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}>
          {buttons?.map((x, index) => (
            <RequestsContainer key={x} val={x} index={index}
              getFriendRequests={handleGetFriendRequests} getSentFriendRequests={handleGetSentRequests}
              friends={friends} setfriends={setfriends}
              friendsRequests={friendsRequests} setfriendsRequests={setfriendsRequests}
              sentFriendRequests={sentFriendRequests} setSentFriendRequests={setSentFriendRequests}
              navigation={navigation} setDisableBtn={setDisableBtn} disableBtn={disableBtn}
              loading={loading} setLoading={setLoading}
            />
          ))}
        </ScrollView>
      </View>

    </SafeAreaView>
  )
}

function RequestsContainer({
  val, index, friends, setfriends, sentFriendRequests, setSentFriendRequests, friendsRequests, setfriendsRequests, navigation, disableBtn, setDisableBtn, loading, setLoading, getFriendRequests, getSentFriendRequests
}) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    index ? await getSentFriendRequests() : await getFriendRequests()
    setRefreshing(false)
  };

  return (
    <View style={[styles.RequestsContainer]} >

      {/* students found container */}
      <View style={styles.studentsFoundContainer}>
        <Text style={styles.text2}>{val}</Text>
        <Text style={styles.text2}>{index ? sentFriendRequests?.length : friendsRequests?.length}</Text>
      </View>

      {loading &&
        <View style={{ height: "90%", justifyContent: "center", alignItems: "center" }}>
          <LottieView
            autoPlay
            style={{
              width: width * 0.5,
              height: width * 0.5,
            }}
            source={require('../../../assets/lotties/loading4.json')}
          />
          <Text style={styles.text1}>Loading requests...</Text>
        </View>
      }

      {!loading &&
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={colors.secondary}
              colors={[colors.secondary]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ alignItems: "center", paddingVertical: 15, gap: height * 0.01 }}>
          {
            index ?
              sentFriendRequests?.length < 1 ?
                <EmptyRequests navigation={navigation} btnText={"Find Friends"} withButton={true} text={"You have 0 sent requests right now"} route={"VertoSearch"} />
                :
                sentFriendRequests?.map((value, index) => (
                  <SearchedStudentCard key={index} friends={friends} disableBtn={disableBtn} friendsRequests={friendsRequests} sentFriendRequests={sentFriendRequests} navigation={navigation} setDisableBtn={setDisableBtn} setSentFriendRequests={setSentFriendRequests} student={value} />
                ))
              :
              friendsRequests?.length < 1 ?
                <EmptyRequests text={"Your request list is empty"} />
                :
                friendsRequests?.map((value, index) => (
                  <SearchedStudentCard key={index} forRequest={true} setfriends={setfriends} friends={friends} disableBtn={disableBtn} friendsRequests={friendsRequests} setfriendsRequests={setfriendsRequests} sentFriendRequests={sentFriendRequests} navigation={navigation} setDisableBtn={setDisableBtn} setSentFriendRequests={setSentFriendRequests} student={value} />
                ))
          }
        </ScrollView>}

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // justifyContent:"space-between",
    height: '100%',
  },

  // header
  header: {
    height: 0.08 * height,
    width: '100%',
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },
  backBtn: {
    width: "10%",
    justifyContent: "center",
    alignItems: 'center',
  },
  title: {
    alignItems: "center",
    justifyContent: "center"
  },

  // body
  body: {
    height: "92%",
    width: '100%',
    alignItems: "center",
    gap: height * 0.02
  },


  
  RequestsContainer: {
    width: width - 10,
    height: '100%',
    marginHorizontal: 5,
    borderRadius: 5
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

