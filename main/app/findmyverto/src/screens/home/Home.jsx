import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Test from './Test';
import Test2 from './Test2';

const Stack = createNativeStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test2" component={Test2} />
        <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  )
}