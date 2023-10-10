import React, { useContext } from 'react'
import { AuthContext } from './context/Auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/auth/Login';
import Attendance from './src/screens/home/Attendance';
import { colors } from './src/constants/colors';
import Test from './src/components/home/Test';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth } = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,animationTypeForReplace:'push',animation:'default'}}>
      {auth.authenticated ?
        <React.Fragment>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Attendance" component={Attendance} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue},headerShadowVisible:false}} />
            <Stack.Screen name="Test" component={Test} options={{headerShown:true,headerTitleAlign:'center',headerTintColor:'white',headerStyle:{backgroundColor:colors.blue},headerShadowVisible:false}} />
        </React.Fragment>
        :
        <React.Fragment>
            <Stack.Screen name="Login" component={Login} />
        </React.Fragment>
      }
    </Stack.Navigator>
  )
}