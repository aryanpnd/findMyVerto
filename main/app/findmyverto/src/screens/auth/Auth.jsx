import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';

const Stack = createNativeStackNavigator();


export default function Auth() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}