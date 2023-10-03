import React, { useContext } from 'react'
import { AuthContext } from './context/Auth'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Login from './src/screens/Login';

const Stack = createNativeStackNavigator();

export default function AuthPage() {
  const { auth } = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.authenticated ?
        <Stack.Screen name="Home" component={Home} />
        :
        <Stack.Screen name="Login" component={Login} />
      }
    </Stack.Navigator>
  )
}