import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'
import { Octicons } from '@expo/vector-icons'

export default function SyncData({ time, syncNow, self,color,bg }) {
    return (
        <View style={{ backgroundColor: bg, paddingHorizontal: 15,flexDirection:'row',justifyContent:'space-between' }}>
            <Text style={{ color: color }}>Last Synced: <Text style={{ fontWeight: "bold" }}>{time}</Text></Text>
            <View style={{display:self?"flex":"none"}}>
            <TouchableOpacity style={{padding:3,borderRadius:5}} onPress={syncNow}>
                <Text style={{color:'white'}}>Sync now <Octicons name='sync'/></Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}