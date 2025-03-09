import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, TouchableOpacity } from 'react-native';
import CustomAlert from '../../components/miscellaneous/CustomAlert';
import SyncingSettings from '../../components/settings/syncingSettings/SyncingSettings';
import AccountSettings from '../../components/settings/AccountSettings/AccountSettings';
import GeneralSettings from '../../components/settings/GeneralSettings/GeneralSettings';
import Toast from 'react-native-toast-message';

export default function Settings() {
  return (
    <ScrollView style={styles.container}>
      <View style={{zIndex: 2}}>
      <CustomAlert />
      <Toast/>
      </View>

      <Text style={styles.category}>Account</Text>
      <AccountSettings />

      <Text style={styles.category}>Auto Syncing</Text>
      <SyncingSettings />

      <Text style={styles.category}>General</Text>
      <GeneralSettings />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  category: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#777',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 5
  },
});