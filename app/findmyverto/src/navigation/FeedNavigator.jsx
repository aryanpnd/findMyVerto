import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from '../screens/feed/Feed';

const Stack = createNativeStackNavigator();

export const FeedNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Feed" component={Feed} />
        </Stack.Navigator>
    );
}