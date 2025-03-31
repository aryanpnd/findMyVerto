import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedNavigator } from './FeedNavigator';
import { HomeNavigator } from './HomeNavigator';


const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationTypeForReplace: 'push',
                animation: 'slide_from_right',
            }}
        >
            {/* Use HomeTabNavigator as the Home screen */}
            <Stack.Screen
                name="HomeScreen"
                component={HomeNavigator}
                options={{ animation: 'slide_from_bottom' }}
            />

            <Stack.Screen name="FeedScreen" component={FeedNavigator} />
            
        </Stack.Navigator>
    );
};
