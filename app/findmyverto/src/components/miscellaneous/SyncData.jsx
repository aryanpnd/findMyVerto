import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import CustomAlert, { useCustomAlert } from './CustomAlert'

export default function SyncData({ time, syncNow, self, color, bg, loader, loading }) {
  const customAlert = useCustomAlert();
  function SyncData() {
    customAlert.show('Sync Data?', 'Are you sure you want to sync your data. It will take some time', [
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
      <View style={[styles.container,{backgroundColor: bg}]}>
        <Text style={{ color: color }}>Last Synced: <Text style={{ fontWeight: "bold" }}>{time}</Text></Text>

        {self&& <View>
          {loader ?
            loading ?
              <TouchableOpacity style={[styles.TouchableOpacity, styles.loader]} onPress={SyncData}>
                <Text style={{ color: 'white' }}>Syncing</Text>
                <ActivityIndicator size={15} color="white"/>
                {/* <LottieView
                  source={require('../../../assets/lotties/loading1.json')} autoPlay loop
                  style={{ width: 25, height: 25 }} /> */}
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.TouchableOpacity} onPress={SyncData}>
                <Text style={{ color: 'white' }}>Sync now <Octicons name='sync' /></Text>
              </TouchableOpacity>
            :
            <TouchableOpacity style={styles.TouchableOpacity} onPress={SyncData}>
              <Text style={{ color: 'white' }}>Sync now <Octicons name='sync' /></Text>
            </TouchableOpacity>
          }
        </View>}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {  paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
  TouchableOpacity: {
    padding: 3,
    borderRadius: 5
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5
  }

})