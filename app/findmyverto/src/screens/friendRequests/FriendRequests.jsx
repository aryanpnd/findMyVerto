import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import Toast from 'react-native-toast-message'
import { AuthContext } from '../../../context/Auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import { MaterialIcons } from '@expo/vector-icons'
import StudentCard from '../../components/vertoSearch/StudentCard'
import LottieView from 'lottie-react-native';
import EmptyRequests from '../../components/miscellaneous/EmptyRequests'
import { getFriendRequests, getSentFriendRequests } from '../../../utils/fetchUtils/handleFriends/handleFriends'
import PagerButtons from '../../components/miscellaneous/PagerButtons'
import { HEIGHT, WIDTH } from '../../constants/styles'
import { useFocusEffect } from '@react-navigation/native'
import { handleBackNavigation } from '../../../utils/navigation/navigationService'
import { AppContext } from '../../../context/MainApp'

const { height, width } = Dimensions.get('window');

export default function FriendRequests({ navigation }) {
  const { auth } = useContext(AuthContext);
  const {friendRequests, setFriendRequests} = useContext(AppContext);

  // Pagination state for friend requests
  const [friendPage, setFriendPage] = useState(1);
  const friendLimit = 15;
  const [friendTotalPages, setFriendTotalPages] = useState(1);

  // Pagination state for sent requests
  const [sentPage, setSentPage] = useState(1);
  const sentLimit = 15;
  const [sentTotalPages, setSentTotalPages] = useState(1);

  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const buttons = ['Requests', 'Sent requests'];
  const onCLick = i => scrollViewRef.current?.scrollTo({ x: i * width });

  const [friends, setfriends] = useState([]);
  const [friendsRequests, setfriendsRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Updated functions that include pagination parameters
  function handleGetFriendRequests() {
    getFriendRequests(auth, 
      setfriendsRequests, // Set the received requests
       setLoading, friendPage, friendLimit, setFriendTotalPages, 
       setFriendRequests // Set the total count of received requests
      );
  }
  function handleGetSentRequests() {
    getSentFriendRequests(auth, setSentFriendRequests, setLoading, sentPage, sentLimit, setSentTotalPages);
  }

  useFocusEffect(
    React.useCallback(() => {
      handleGetFriendRequests();
      handleGetSentRequests();
    }, [friendPage, sentPage])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>

      <View style={styles.header}>
        {/* Back navigation button */}
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={() => handleBackNavigation(navigation)}>
            <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
          </TouchableOpacity>
        </View>
        {/* Title */}
        <View style={styles.title}>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Requests</Text>
        </View>
      </View>

      <View style={styles.body}>
        <PagerButtons
          buttons={buttons}
          onClick={onCLick}
          scrollX={scrollX}
          containerWidth={WIDTH(90)}
          containerHeight={HEIGHT(6)}
          pageWidth={width}
        />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {buttons?.map((x, index) => (
            <RequestsContainer
              key={x}
              val={x}
              index={index}
              getFriendRequests={handleGetFriendRequests}
              getSentFriendRequests={handleGetSentRequests}
              friends={friends}
              setfriends={setfriends}
              friendsRequests={friendsRequests}
              setfriendsRequests={setfriendsRequests}
              sentFriendRequests={sentFriendRequests}
              setSentFriendRequests={setSentFriendRequests}
              navigation={navigation}
              setDisableBtn={setDisableBtn}
              disableBtn={disableBtn}
              loading={loading}
              setLoading={setLoading}
              // Pass pagination props based on the current tab
              page={index === 0 ? friendPage : sentPage}
              totalPages={index === 0 ? friendTotalPages : sentTotalPages}
              setPage={index === 0 ? setFriendPage : setSentPage}
              getRequests={index === 0 ? handleGetFriendRequests : handleGetSentRequests}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


function RequestsContainer({
  val,
  index: tabIndex, // Renamed for clarity: tabIndex = 0 for received, 1 for sent
  friends,
  setfriends,
  sentFriendRequests,
  setSentFriendRequests,
  friendsRequests,
  setfriendsRequests,
  navigation,
  disableBtn,
  setDisableBtn,
  loading,
  setLoading,
  getFriendRequests,
  getSentFriendRequests,
  page,
  totalPages,
  setPage,
  getRequests
}) {
  const [refreshing, setRefreshing] = useState(false);

  // Use onRefresh to call the respective API function based on the tab
  const onRefresh = async () => {
    setRefreshing(true);
    if (tabIndex) {
      await getSentFriendRequests();
    } else {
      await getFriendRequests();
    }
    setRefreshing(false);
  };

  // Determine data based on the current tab: received or sent requests
  const data = tabIndex ? sentFriendRequests : friendsRequests;

  // Render each item depending on the tab
  const renderItem = ({ item }) =>
    tabIndex ? (
      <StudentCard
        friends={friends}
        disableBtn={disableBtn}
        friendsRequests={friendsRequests}
        sentFriendRequests={sentFriendRequests}
        navigation={navigation}
        setDisableBtn={setDisableBtn}
        setSentFriendRequests={setSentFriendRequests}
        student={item}
      />
    ) : (
      <StudentCard
        forRequest={true}
        setfriends={setfriends}
        friends={friends}
        disableBtn={disableBtn}
        friendsRequests={friendsRequests}
        setfriendsRequests={setfriendsRequests}
        sentFriendRequests={sentFriendRequests}
        navigation={navigation}
        setDisableBtn={setDisableBtn}
        setSentFriendRequests={setSentFriendRequests}
        student={item}
      />
    );

  // Define the empty list component based on the tab
  const ListEmptyComponent = () =>
    tabIndex ? (
      <EmptyRequests
        navigation={navigation}
        btnText={"Find Friends"}
        withButton={true}
        text={"You have 0 sent requests right now"}
        route={"VertoSearch"}
      />
    ) : (
      <EmptyRequests text={"Your request list is empty"} />
    );

  return (
    <View style={styles.RequestsContainer}>
      {/* Header: Tab Title and Count */}
      <View style={styles.studentsFoundContainer}>
        <Text style={styles.text2}>{val}</Text>
        <Text style={styles.text2}>{data?.length}</Text>
      </View>

      {/* Loading indicator */}
      {loading ? (
        <View style={{ height: "90%", justifyContent: "center", alignItems: "center" }}>
          <LottieView
            autoPlay
            style={{ width: width * 0.5, height: width * 0.5 }}
            source={require('../../../assets/lotties/loading4.json')}
          />
          <Text style={styles.text1}>Loading requests...</Text>
        </View>
      ) : (
        // FlatList for rendering friend requests
        <FlatList
          data={data}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            alignItems: "center",
            paddingVertical: 15,
            gap: height * 0.01,
            paddingBottom: 20,
            paddingHorizontal: 5
          }}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            disabled={page <= 1}
            onPress={() => {
              setPage(page - 1);
              getRequests();
            }}
          >
            <Text style={[styles.paginationButton, page <= 1 && { opacity: 0.5 }]}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>
            Page {page} of {totalPages}
          </Text>
          <TouchableOpacity
            disabled={page >= totalPages}
            onPress={() => {
              setPage(page + 1);
              getRequests();
            }}
          >
            <Text style={[styles.paginationButton, page >= totalPages && { opacity: 0.5 }]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
    width: "100%",
    paddingHorizontal: 20,
    height: height * 0.05,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center"
  },
  text1: { fontSize: 16, textAlign: "center", fontWeight: "500", color: "grey" },
  text2: { fontSize: 18, fontWeight: "500", color: colors.lightDark },
  // New pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  paginationButton: {
    fontSize: 16,
    color: colors.secondary,
  },
  paginationText: {
    fontSize: 16,
    color: colors.lightDark,
  },
});

