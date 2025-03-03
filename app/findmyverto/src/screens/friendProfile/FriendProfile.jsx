import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { colors } from '../../constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { AuthContext } from '../../../context/Auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StudentProfile from '../../components/Profile/StudentProfile'
import { getFriendDetails } from '../../../utils/fetchUtils/friendData/handleFriendsData'
import SyncData from '../../components/miscellaneous/SyncData'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { removeFriend } from '../../../utils/fetchUtils/handleFriends/handleFriends'
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert'
import { useNavigation } from '@react-navigation/native'
import { AppContext } from '../../../context/MainApp'
import { friendsStorage, userStorage } from '../../../utils/storage/storage'
import { globalStyles, WIDTH } from '../../constants/styles'

const { height, width } = Dimensions.get('window')

const navigations = [
  {
    name: "attendance",
    title: "Attendance",
    icon: require('../../../assets/icons/attendance.png'),
    route: "FriendAttendance"
  },
  {
    name: "timetable",
    title: "Timetable",
    icon: require('../../../assets/icons/schedule.png'),
    route: "FriendTimetable"
  },
  {
    name: "timetable",
    title: "Courses",
    icon: require('../../../assets/icons/courses.png'),
    route: "FriendCourses"
  },
  {
    name: "exams",
    title: "Exams",
    icon: require('../../../assets/icons/exam.png'),
    route: "FriendExams"
  },
  {
    name: "marks",
    title: "Marks",
    icon: require('../../../assets/icons/marks.png'),
    route: "FriendMarks"
  },
  {
    name: "cgpa",
    title: "CGPA",
    icon: require('../../../assets/icons/cgpa.png'),
    route: "FriendCGPA"
  },
  {
    name: "assignments",
    title: "Assignments",
    icon: require('../../../assets/icons/assignment.png'),
    route: "FriendAssignments"
  },
  {
    name: "drives",
    title: "Drives",
    icon: require('../../../assets/icons/interview.png'),
    route: "FriendDrives"
  }
]

export default function FriendProfile({ route }) {
  const { _id } = route.params
  const navigation = useNavigation()

  const { auth } = useContext(AuthContext)
  const { friendsRefreshing, setFriendsRefreshing } = useContext(AppContext)

  const [student, setStudent] = useState({})
  const [firstName, setFirstName] = useState("")
  const [loading, setLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  async function handleFetchData(loader = false) {
    await getFriendDetails(auth, _id, setStudent, setLoading, loader)
  }

  async function fetchDataLocally() {
    try {
      const studentRaw = friendsStorage.getString(`${_id}`)
      if (studentRaw) {
        const student = JSON.parse(studentRaw)
        setStudent(student)
        setRefresh(!refresh)
      } else {
        await handleFetchData(setLoading)
      }
    } catch (error) {
      console.error(error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.message}`
      })
    }
  }

  useEffect(() => {
    fetchDataLocally()
  }, [])

  useEffect(() => {
    handleFetchData()
  }, [refresh])

  useEffect(() => {
    setFirstName(student?.name?.split(" ")[0])
  }, [student])

  async function handleRemoveFriend() {
    const customAlert = useCustomAlert()

    customAlert.show(
      `Remove ${firstName}?`,
      `Are you sure you want to remove ${firstName} as a friend?`,
      [
        {
          text: 'Remove',
          onPress: async () => {
            await removeFriend(auth, _id, setRemoveLoading)
            navigation.goBack()
            setFriendsRefreshing(!friendsRefreshing)
          }
        },
        { text: 'Cancel', onPress: () => { } }
      ]
    )
  }

  function handleNotAllowedPress(title) {
    return () => {
      Toast.show({
        type: "info",
        text1: "Private",
        text2: `${student?.name?.split(" ")[0]} has not allowed to show ${title}`
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ zIndex: 2 }}>
        <Toast />
        <StatusBar style='auto' />
        <CustomAlert />
      </View>

      <View style={styles.header}>
        {/* Back navigation button */}
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
          </TouchableOpacity>
        </View>
        {/* Title */}
        <View style={styles.title}>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>{firstName}</Text>
        </View>
        {/* Remove Friend */}
        <View style={styles.backBtn}>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <SyncData self={false} time={formatTimeAgo(student.lastSync)} color={"grey"} bg={colors.whitePrimary} />
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      >
        <StudentProfile student={student} loading={loading} />
        <View style={styles.NavigationsContainer}>
          {[...navigations]
            .sort((a, b) => {
              const aAllowed = student.allowedFieldsToShow?.includes(a.name) || false;
              const bAllowed = student.allowedFieldsToShow?.includes(b.name) || false;
              // If a is allowed and b is not, a comes first (-1); vice versa (+1)
              return (aAllowed === bAllowed) ? 0 : (aAllowed ? -1 : 1);
            })
            .map((value) => (
              <Pressable
                onPress={
                  student.allowedFieldsToShow?.includes(value.name)
                    ? () => navigation.navigate(value.route, { id: _id, name: firstName })
                    : handleNotAllowedPress(value.title)
                }
                key={value.title}
                style={[
                  styles.NavigationsCard,
                  !student.allowedFieldsToShow?.includes(value.name) && { opacity: 0.5 }
                ]}
              >
                <Image
                  source={value.icon}
                  style={{
                    height: width * 0.12,
                    width: WIDTH(12),
                    resizeMode: "contain"
                  }}
                  transition={1000}
                />
                <Text style={styles.text2}>{value.title}</Text>
              </Pressable>
            ))
          }
        </View>

      <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFriend}>
        {removeLoading ? (
          <ActivityIndicator size={25} color={colors.red} />
        ) : <>
          <Ionicons name="person-remove-sharp" size={25} color={colors.red} />
          <Text style={[styles.text2,{color:colors.red,marginLeft:10}]}>Remove</Text>
        </>
        }
      </TouchableOpacity>
      </ScrollView>



    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  // Header styles
  header: {
    height: 0.08 * height,
    width: '100%',
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    alignItems: "center",
    justifyContent: "center"
  },
  backBtn: {
    width: "10%",
    justifyContent: "center",
    alignItems: 'center'
  },
  // Body
  body: {
    width: '100%',
  },
  // Updated grid container for 3 columns
  NavigationsContainer: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30
  },
  // Each card takes ~30% width with a square aspect ratio for a grid layout.
  NavigationsCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  removeButton: {
    width: WIDTH(90),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.whitePrimary,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 15,
    ...globalStyles.elevationMin    
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
