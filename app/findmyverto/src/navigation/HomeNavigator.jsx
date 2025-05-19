import Settings from '../screens/settings/Settings';
import Attendance from '../screens/Attendance/Attendance';
import AttendanceDetails from '../screens/Attendance/AttendanceDetails';
import TimeTable from '../screens/TimeTable/TimeTable';
import Makeup from '../screens/TimeTable/Makeup';
import Courses from '../screens/TimeTable/Courses';
import Marks from '../screens/marksAndCgpa/Marks';
import MarksDetails from '../screens/marksAndCgpa/MarksDetails';
import Cgpa from '../screens/marksAndCgpa/Cgpa';
import CgpaDetails from '../screens/marksAndCgpa/CgpaDetails';
import Exams from '../screens/Exams/Exams';
import Assignments from '../screens/Assignments/Assignments';
import MyMessages from '../screens/MyMessages/MyMessages';
import MyMessagesSearch from '../screens/MyMessages/MyMessagesSearch';
import MyDrives from '../screens/MyDrives/MyDrives';
import LeaveSlip from '../screens/LeaveSlip/LeaveSlip';
import MyProfile from '../screens/MyProfile/MyProfile';
import VertoSearch from '../screens/search/VertoSearch';
import FriendRequests from '../screens/friendRequests/FriendRequests';
import Friends from '../screens/friends/Friends';
import FriendProfile from '../screens/friendProfile/FriendProfile';
import FriendAttendance from '../components/friendProfile/FriendAttendance';
import FriendTimetable from '../components/friendProfile/FriendTimetable';
import FriendCourses from '../components/friendProfile/FriendCourses';
import FriendExams from '../components/friendProfile/FriendExams';
import FriendMarks from '../components/friendProfile/FriendMarks';
import FriendCGPA from '../components/friendProfile/FriendCGPA';
import FriendAssignments from '../components/friendProfile/FriendAssignments';
import FriendDrives from '../components/friendProfile/FriendDrives';
import { CustomBackButton } from '../components/miscellaneous/CustomBackButton';
import { colors } from '../constants/colors';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/Home';
import Feed from '../screens/feed/Feed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { act, useEffect, useRef } from 'react';
import { TabBar } from '../components/miscellaneous/TabBar';
import Chats from '../screens/Chats/Chats';
import FriendAttendanceDetails from '../components/friendProfile/FriendAttendanceDetails';


const Tab = AnimatedTabBarNavigator();
const Stack = createNativeStackNavigator();

const HomeTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'white',
                activeBackgroundColor: colors.secondary,
                inactiveTintColor: "grey",
                tabStyle: {
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"

                component={Home}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                    title: 'Home',
                }} />
            <Tab.Screen
                name="Friends"

                component={Friends}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome5 name="user-friends" size={size} color={color} />
                    ),
                    title: 'Friends',
                }} />
            <Tab.Screen
                name="FeedTab"
                component={Feed}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name="newspaper" size={size} color={color} />
                    ),
                    title: 'Feed',
                }}
            />
            <Tab.Screen
                name="ChatsTab"
                component={Chats}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <AntDesign name="message1" size={size} color={color} />
                    ),
                    title: 'Chats',
                }}
            />
        </Tab.Navigator>
    );
};



export const HomeNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationTypeForReplace: 'push',
                animation: 'slide_from_right',
            }}
        >
            {/* Use HomeTabNavigator as the Home screen */}
            <Stack.Screen
                name="Home"
                component={HomeTabNavigator}
                options={{ animation: 'slide_from_bottom' }}
            />

            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerStyle: { backgroundColor: colors.whitePrimary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="black" />,
                    animation: 'slide_from_bottom',
                }}
            />

            <Stack.Screen
                name="Attendance"
                component={Attendance}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} />

            <Stack.Screen
                name="Timetable"
                component={TimeTable}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="Makeup"
                component={Makeup}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="Courses"
                component={Courses}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="Marks"
                component={Marks}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="MarksDetails"
                component={MarksDetails}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="CGPA"
                component={Cgpa}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="CGPADetails"
                component={CgpaDetails}
                options={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'black' }}
            />
            <Stack.Screen
                name="Exams"
                component={Exams}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="Assignments"
                component={Assignments}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    headerLeft: () => <CustomBackButton />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="MyMessages"
                component={MyMessages}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: 'My Messages',
                    headerLeft: () => <CustomBackButton color="white" />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="MyMessagesSearch"
                component={MyMessagesSearch}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: 'Search Messages',
                }}
            />
            <Stack.Screen
                name="MyDrives"
                component={MyDrives}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    title: 'My Drives',
                    headerLeft: () => <CustomBackButton />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="LeaveSlip"
                component={LeaveSlip}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    title: 'Leave slip',
                    headerLeft: () => <CustomBackButton />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.whitePrimary },
                    headerLeft: () => <CustomBackButton />,
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen name="VertoSearch" component={VertoSearch} />
            <Stack.Screen name="FriendRequests" component={FriendRequests} />
            <Stack.Screen name="Friends" component={Friends} />
            <Stack.Screen name="FriendProfile" component={FriendProfile} />
            <Stack.Screen
                name="FriendAttendance"
                component={FriendAttendance}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: "Friend's Attendance",
                }}
            />
            <Stack.Screen
                name="FriendAttendanceDetails"
                component={FriendAttendanceDetails}
            />
            <Stack.Screen
                name="FriendTimetable"
                component={FriendTimetable}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: "Friend's Timetable",
                }}
            />
            <Stack.Screen
                name="FriendCourses"
                component={FriendCourses}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: "Friend's Courses",
                }}
            />
            <Stack.Screen
                name="FriendExams"
                component={FriendExams}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                    headerShadowVisible: false,
                    title: "Friend's Exams",
                }}
            />
            <Stack.Screen
                name="FriendMarks"
                component={FriendMarks}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="FriendCGPA"
                component={FriendCGPA}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: colors.secondary },
                }}
            />
            <Stack.Screen
                name="FriendAssignments"
                component={FriendAssignments}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="FriendDrives"
                component={FriendDrives}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                }}
            />
        </Stack.Navigator>
    );
}