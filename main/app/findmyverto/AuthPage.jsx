import React, { useContext } from 'react'
import { AuthContext } from './context/Auth'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/home/Home';
import Auth from './src/screens/auth/Auth';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth } = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.authenticated ?
        <Stack.Screen name="Home" component={Home} />
        :
        <Stack.Screen name="Auth" component={Auth} />
      }
    </Stack.Navigator>
  )
}