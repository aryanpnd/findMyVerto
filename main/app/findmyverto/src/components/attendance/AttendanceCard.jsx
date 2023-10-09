import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default function AttendanceCard({ attendance,colors }) {
    return (
        <LinearGradient 
        colors={colors}
        style={styles.cardContainer}
        start={{ x: 0, y: 0 }} // Start from the left
        end={{ x: 1, y: 0 }} 
        >
            <View style={styles.details}>
                <Text>hello</Text>
            </View>

            <View style={styles.progress}>
                {/* <AttendanceProgressBar attendence={parseInt(attendance?.attendanceHistory?.[attendance.attendanceHistory?.length - 1]?.totalPercentage ?? 0)} size={25} /> */}
                <AnimatedCircularProgress
                size={100}
                width={10}
                fill={parseInt(attendance?.totalPercentage??0)}
                rotation={360}
                tintColor={parseInt(attendance?.totalPercentage??0) > 75 ? "#2ecc71" : parseInt(attendance?.totalPercentage??0) > 50 ? '#4834d4' : '#ea2027'}
                backgroundColor="#ffffff87" />
            <Text style={{ position: 'absolute', justifyContent:"center", color: 'white',fontSize:25,fontWeight:'500' }}>{parseInt(attendance?.totalPercentage??0)}%</Text>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '90%',
        height: '80%',
        borderRadius: 25,
        flexDirection: 'row',
        padding:10
    },
    details: {
        width:'65%'
    },
    progress: {
        width:"35%",
        justifyContent:'center',
        alignItems:"center"
    }
})