import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/auth/Login';
import Attendance from './src/screens/Attendance/Attendance';
import { colors } from './src/constants/colors';
import TimeTable from './src/screens/TimeTable/TimeTable';
import VertoSearch from './src/screens/search/VertoSearch';
import FriendRequests from './src/screens/friendRequests/FriendRequests';
import Friends from './src/screens/friends/Friends';
import MyProfile from './src/screens/MyProfile/MyProfile';
import FriendProfile from './src/screens/friendProfile/FriendProfile';
import FriendAttendance from './src/components/friendProfile/FriendAttendance';
import FriendTimetable from './src/components/friendProfile/FriendTimetable';
import * as SplashScreen from 'expo-splash-screen';
import AttendanceDetails from './src/screens/Attendance/AttendanceDetails';
import { View, ActivityIndicator } from 'react-native';
import Marks from './src/screens/marksAndCgpa/Marks';
import Cgpa from './src/screens/marksAndCgpa/Cgpa';
import MarksDetails from './src/screens/marksAndCgpa/MarksDetails';
import CgpaDetails from './src/screens/marksAndCgpa/CgpaDetails';
import FriendMarks from './src/components/friendProfile/FriendMarks';
import FriendCGPA from './src/components/friendProfile/FriendCGPA';
import Exams from './src/screens/Exams/Exams';
import Assignments from './src/screens/Assignments/Assignments';
import MyMessages from './src/screens/MyMessages/MyMessages';
import LeaveSlip from './src/screens/LeaveSlip/LeaveSlip';
import MyDrives from './src/screens/MyDrives/MyDrives';
import Courses from './src/screens/TimeTable/Courses';
import FriendCourses from './src/components/friendProfile/FriendCourses';
import FriendExams from './src/components/friendProfile/FriendExams';
import FriendAssignments from './src/components/friendProfile/FriendAssignments';
import FriendDrives from './src/components/friendProfile/FriendDrives';
import MyMessagesSearch from './src/screens/MyMessages/MyMessagesSearch';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth, loadAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      setLoading(true);
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setLoading(false);
      }
    }

    prepare();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={"white"} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationTypeForReplace: 'push', animation: 'slide_from_right' }}>
      {!loading && auth.authenticated ? (
        <React.Fragment>
          <Stack.Screen name="Home" component={Home} />

          <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false }} />
          <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} />

          <Stack.Screen name="Timetable" component={TimeTable} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false }} />
          <Stack.Screen name="Courses" component={Courses} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false }} />

          <Stack.Screen name="Marks" component={Marks} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }} />
          <Stack.Screen name="MarksDetails" component={MarksDetails} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }} />

          <Stack.Screen name="CGPA" component={Cgpa} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false, headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary } }} />
          <Stack.Screen name="CGPADetails" component={CgpaDetails} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }} />

          <Stack.Screen name="Exams" component={Exams} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerShadowVisible: false , headerStyle: { backgroundColor: colors.secondary } }}/>

          <Stack.Screen name="Assignments" component={Assignments} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }}/>

          <Stack.Screen name="MyMessages" component={MyMessages} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title:"My Messages" }}/>
          <Stack.Screen name="MyMessagesSearch" component={MyMessagesSearch} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title:"Search Messages" }}/>

          <Stack.Screen name="MyDrives" component={MyDrives} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false, title:"My Drives" }}/>
          
          <Stack.Screen name="LeaveSlip" component={LeaveSlip} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false, title:"Leave slip" }}/>

          <Stack.Screen name="MyProfile" component={MyProfile} />

          <Stack.Screen name="VertoSearch" component={VertoSearch} />
          <Stack.Screen name="FriendRequests" component={FriendRequests} />
          <Stack.Screen name="Friends" component={Friends} />
          
          <Stack.Screen name="FriendProfile" component={FriendProfile} />
          <Stack.Screen name="FriendAttendance" component={FriendAttendance} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title: "Friend's Attendance" }} />
          <Stack.Screen name="FriendTimetable" component={FriendTimetable} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title: "Friend's Timetable" }} />
          <Stack.Screen name="FriendCourses" component={FriendCourses} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title: "Friend's Courses" }} />
          <Stack.Screen name="FriendExams" component={FriendExams} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary }, headerShadowVisible: false, title: "Friend's Exams" }} />
          <Stack.Screen name="FriendMarks" component={FriendMarks} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }} />
          <Stack.Screen name="FriendCGPA" component={FriendCGPA} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false, headerTintColor: 'white', headerStyle: { backgroundColor: colors.secondary } }} />
          <Stack.Screen name="FriendAssignments" component={FriendAssignments} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }}/>
          <Stack.Screen name="FriendDrives" component={FriendDrives} options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black', headerShadowVisible: false }}/>

        </React.Fragment>
      ) : (
        <React.Fragment>
          <Stack.Screen name="Login" component={Login} />
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
}