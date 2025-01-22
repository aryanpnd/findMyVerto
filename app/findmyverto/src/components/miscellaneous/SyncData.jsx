import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'
import { Octicons } from '@expo/vector-icons'
import CustomAlert, { useCustomAlert } from './CustomAlert'

export default function SyncData({ time, syncNow, self, color, bg }) {
  const customAlert = useCustomAlert();
  function SyncData() {
    customAlert.show('Sync Data?', 'Are you sure you wan to sync your data. It will take some time', [
      {
        text: 'Sync now', onPress: async () => {
          syncNow()
        }
      },
      {
        text: 'Cancel',
        onPress: () => { }
      },
    ]);
  }
  return (
    <>
      <CustomAlert />
      <View style={{ backgroundColor: bg, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
        <Text style={{ color: color }}>Last Synced: <Text style={{ fontWeight: "bold" }}>{time}</Text></Text>
        <View style={{ display: self ? "flex" : "none" }}>
          <TouchableOpacity style={{ padding: 3, borderRadius: 5 }} onPress={SyncData}>
            <Text style={{ color: 'white' }}>Sync now <Octicons name='sync' /></Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}