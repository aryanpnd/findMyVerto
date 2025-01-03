import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/Auth'
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

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth,loadAuth } = useContext(AuthContext)
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,animationTypeForReplace:'push',animation:'slide_from_right'}}>
      { !loading && auth.authenticated ?
        <React.Fragment>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Attendance" component={Attendance} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.secondary},headerShadowVisible:false}} />
            <Stack.Screen name="Timetable" component={TimeTable} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.secondary},headerShadowVisible:false}} />
            <Stack.Screen name="VertoSearch" component={VertoSearch} />
            <Stack.Screen name="FriendRequests" component={FriendRequests} />
            <Stack.Screen name="Friends" component={Friends} />
            <Stack.Screen name="MyProfile" component={MyProfile} />
            <Stack.Screen name="FriendProfile" component={FriendProfile} />
            <Stack.Screen name="FriendAttendance" component={FriendAttendance} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.secondary},headerShadowVisible:false,title:"Friend's Attendance"}}/>
            <Stack.Screen name="FriendTimetable" component={FriendTimetable} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.secondary},headerShadowVisible:false,title:"Friend's Attendance"}}/>
        </React.Fragment>
        :
        <React.Fragment>
            <Stack.Screen name="Login" component={Login} />
        </React.Fragment>
      }
    </Stack.Navigator>
  )
}