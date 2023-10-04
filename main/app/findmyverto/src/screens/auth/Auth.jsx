import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Toast from 'react-native-toast-message';
import Test3 from './Test3';

const Stack = createNativeStackNavigator();


export default function Auth() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Test" component={Test3} />
        </Stack.Navigator>
    )
}