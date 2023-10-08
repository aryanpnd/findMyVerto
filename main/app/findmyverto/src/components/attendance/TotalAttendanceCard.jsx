import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function TotalAttendanceCard() {
  return (
    <LinearGradient colors={["#0f0c29", "#302b63"]} style={styles.cardContainer}>
        
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
    cardContainer:{
        width:'90%',
        height:'80%',
        borderRadius:25,
        backgroundColor:'red',

    }
})