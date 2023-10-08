import { View, Text } from 'react-native'
import React from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default function AttendanceProgressBar({attendence}) {
    return (
        <View>
            <AnimatedCircularProgress
                size={50}
                width={5}
                fill={attendence}
                rotation={360}
                tintColor={attendence > 75 ? "#2ecc71" : attendence > 50 ? '#4834d4' : '#ea2027'}
                backgroundColor="#ffffff87" />
            <Text style={{ position: 'absolute', top: 15, right: 11, color: 'white' }}>{attendence}%</Text>
        </View>
    )
}