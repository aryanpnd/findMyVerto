import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import CustomAlert, { useCustomAlert } from './CustomAlert'
import { globalStyles } from '../../constants/styles';
import ButtonV1 from './buttons/ButtonV1';

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
              <ButtonV1 scaleInValue={0.9} style={[styles.TouchableOpacity, styles.loader]} onPress={SyncData}>
                <Text style={{ color: color }}>Syncing</Text>
                <ActivityIndicator size={15} color={color} />
              </ButtonV1>
              :
              <ButtonV1 scaleInValue={0.9} style={styles.TouchableOpacity} onPress={SyncData}>
                <Text style={{ color: color }}>Sync now <Octicons name='sync' /></Text>
              </ButtonV1>
            :
            <ButtonV1 scaleInValue={0.9} style={styles.TouchableOpacity} onPress={SyncData}>
              <Text style={{ color: color }}>Sync now <Octicons name='sync' /></Text>
            </ButtonV1>
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
    width: "100%",
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