import React, { useContext } from 'react'
import { AuthContext } from './context/Auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/auth/Login';
import Attendance from './src/screens/Attendance/Attendance';
import { colors } from './src/constants/colors';
import TimeTable from './src/screens/TimeTable/TimeTable';
import VertoSearch from './src/screens/search/VertoSearch';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth } = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,animationTypeForReplace:'push',animation:'slide_from_right'}}>
      {auth.authenticated ?
        <React.Fragment>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Attendance" component={Attendance} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue2},headerShadowVisible:false}} />
            <Stack.Screen name="Timetable" component={TimeTable} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue2},headerShadowVisible:false}} />
            <Stack.Screen name="VertoSearch" component={VertoSearch} />
            {/* <Stack.Screen name="Test" component={Test} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue2},headerShadowVisible:false}} />
            <Stack.Screen name="CardSwiper" component={CardSwiper} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue2},headerShadowVisible:false}} /> */}
        </React.Fragment>
        :
        <React.Fragment>
            <Stack.Screen name="Login" component={Login} />
        </React.Fragment>
      }
    </Stack.Navigator>
  )
}