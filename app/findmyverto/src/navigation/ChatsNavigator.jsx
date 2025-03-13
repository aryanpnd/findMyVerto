import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from '../screens/Chats/Chats';

const Stack = createNativeStackNavigator();

export const ChatsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Chats" component={Chats} />
        </Stack.Navigator>
    );
}