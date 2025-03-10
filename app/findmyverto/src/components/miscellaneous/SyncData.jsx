import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import CustomAlert, { useCustomAlert } from './CustomAlert'
import { globalStyles } from '../../constants/styles';

export default function SyncData({ time, syncNow, self, color, bg, loader, loading }) {
  const customAlert = useCustomAlert();
  function SyncData() {
    customAlert.show('Sync Data?', 'Are you sure you want to sync your data. It will take some time', [
      {
        text: 'Sync now',
        color: "black",
        textColor: "white",
        onPress: async () => {
          syncNow()
        }
      },
      {
        text: 'Cancel',
        color: "white",
        textColor: "black",
        onPress: () => { }
      },
    ]);
  }
  return (
    <>
      <CustomAlert />
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Text style={{ color: color }}>Last Synced: <Text style={{ fontWeight: "bold" }}>{time}</Text></Text>

        {self && <View>
          {loader ?
            loading ?
              <TouchableOpacity style={[styles.TouchableOpacity, styles.loader]} onPress={SyncData}>
                <Text style={{ color: color }}>Syncing</Text>
                <ActivityIndicator size={15} color={color} />
                {/* <LottieView
                  source={require('../../../assets/lotties/loading1.json')} autoPlay loop
                  style={{ width: 25, height: 25 }} /> */}
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.TouchableOpacity} onPress={SyncData}>
                <Text style={{ color: color }}>Sync now <Octicons name='sync' /></Text>
              </TouchableOpacity>
            :
            <TouchableOpacity style={styles.TouchableOpacity} onPress={SyncData}>
              <Text style={{ color: color }}>Sync now <Octicons name='sync' /></Text>
            </TouchableOpacity>
          }
        </View>}
      </View>
      {!loading && <View style={[styles.infoContainer, { backgroundColor: bg }]} >
        <MaterialCommunityIcons name="information-outline" size={13} color={color} />
        <Text style={[styles.infoText, { color: color }]}>This data is synced from the UMS and may be inaccurate. If you suspect it's outdated, please sync it.</Text>
      </View>}
    </>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
  TouchableOpacity: {
    padding: 3,
    borderRadius: 5
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    gap: 10,
    // marginTop: 2
  },
  infoText: {
    fontSize: 10
  }

})