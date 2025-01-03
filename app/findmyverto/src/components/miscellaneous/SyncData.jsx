import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'
import { Octicons } from '@expo/vector-icons'

export default function SyncData({ time, syncNow, self,color,bg }) {
    function SyncData() {
        Alert.alert('Are you sure?', 'It will take some minutes to sync data with your UMS', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'Sync now', onPress: async () => {
              syncNow()
            }},
          ]);
    }
    return (
        <View style={{ backgroundColor: bg, paddingHorizontal: 15,flexDirection:'row',justifyContent:'space-between',alignItems:"center" }}>
            <Text style={{ color: color }}>Last Synced: <Text style={{ fontWeight: "bold" }}>{time}</Text></Text>
            <View style={{display:self?"flex":"none"}}>
            <TouchableOpacity style={{padding:3,borderRadius:5}} onPress={SyncData}>
                <Text style={{color:'white'}}>Sync now <Octicons name='sync'/></Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}