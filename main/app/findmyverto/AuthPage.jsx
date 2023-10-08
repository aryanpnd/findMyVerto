import React, { useContext } from 'react'
import { AuthContext } from './context/Auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Login from './src/screens/auth/Login';
import Attendance from './src/screens/home/Attendance';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth } = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.authenticated ?
        <React.Fragment>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Attendance" component={Attendance} />
        </React.Fragment>
        :
        <React.Fragment>
            <Stack.Screen name="Login" component={Login} />
        </React.Fragment>
      }
    </Stack.Navigator>
  )
}