import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default function AttendanceProgressBar({ attendance, size }) {
    return (
        <View>
            <AnimatedCircularProgress
                size={size}
                width={5}
                fill={attendance}
                rotation={360}
                tintColor={attendance > 75 ? "#2ecc71" : attendance > 50 ? '#4834d4' : '#ea2027'}
                backgroundColor="#ffffff87" />
            <Text style={{
                position: 'absolute', top: attendance === 100 ? 17 : 15, right: 11, color: 'white',
                fontSize: attendance === 100 ? 11 : 14
            }}>{attendance}%</Text>
        </View>
    )
}