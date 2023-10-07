import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Test2 from './Test2';
import Front from './Front';

const Stack = createNativeStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Front" component={Front} />
        <Stack.Screen name="Test2" component={Test2} />
    </Stack.Navigator>
  )
}