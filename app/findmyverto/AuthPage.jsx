import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from './context/Auth';
import { appStorage } from './utils/storage/storage';
import { fetchServers } from './utils/settings/changeServer';
import { requestNotificationPermission } from './utils/notifications/notificationPermission';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { colors } from './src/constants/colors';

export default function AuthPage({ notificationSheetRef }) {
  const { auth, loadAuth, onboarding, setOnboarding } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      setLoading(true);

      try {
        await SplashScreen.preventAutoHideAsync();

        const isFirstTime = appStorage.getString('isFirstTime');
        if (!isFirstTime) {
          setOnboarding(true);
          appStorage.set('isFirstTime', "no");
        }

        await loadAuth();
        fetchServers();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setLoading(false);
        requestNotificationPermission(notificationSheetRef);
      }
    }

    prepare();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        {/* Optionally, add an ActivityIndicator or similar loading indicator */}
      </View>
    );
  }

  return auth.authenticated ? <AppNavigator /> : <AuthNavigator onboarding={onboarding} />;
}
