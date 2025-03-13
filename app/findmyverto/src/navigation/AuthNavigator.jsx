import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import OnboardingScreen from '../screens/Onboarding/Onboarding';

const Stack = createNativeStackNavigator();

export const AuthNavigator = ({ onboarding }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      {onboarding && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};
