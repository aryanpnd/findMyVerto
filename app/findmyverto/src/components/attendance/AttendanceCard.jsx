import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { globalStyles } from '../../constants/styles'

export default function AttendanceCard({ attendance, colors }) {
    return (
        <LinearGradient
            colors={colors}
            style={[styles.cardContainer, globalStyles.elevationMin]}
            start={{ x: 0, y: 0 }} // Start from the left
            end={{ x: 1, y: 0 }}
        >
            <Text style={[styles.textCourse, { marginLeft: 10 }]}>{
                attendance?.subject_name ? `${attendance.subject_code}: ${attendance.subject_name}` : "Aggregate Attendance"
            }</Text>

            <View style={{ flex: 4, flexDirection: 'row' }}>

                <View style={styles.detailsContainer}>

                    <View style={{ flex: 4.5, justifyContent: "space-evenly", paddingLeft: 5 }}>
                        <Text style={[
                            styles.textAttendanceDetails,
                            { display: (attendance?.last_attended ?? '') === "" ? "none" : "flex" }
                        ]}>Last Attended:
                            <Text style={styles.textCourse}> {attendance?.last_attended ?? 0}</Text>
                        </Text>

                        <Text style={styles.textAttendanceDetails}>Duty leaves: <Text style={styles.textCourse}>{parseInt(attendance?.duty_leaves ?? 0)}</Text></Text>

                        <Text style={styles.textAttendanceDetails}>Total classes: <Text style={styles.textCourse}>{parseInt(attendance?.total_delivered ?? 0)}</Text></Text>

                        <Text style={styles.textAttendanceDetails}>Total Attended: <Text style={styles.textCourse}>{parseInt(attendance?.total_attended ?? 0)}</Text></Text>
                    </View>
                </View>

                <View style={styles.progress}>
                    <AnimatedCircularProgress
                        size={95}
                        width={8}
                        fill={parseInt(attendance?.agg_attendance ?? 0)}
                        rotation={360}
                        tintColor={parseInt(attendance?.agg_attendance ?? 0) > 75 ? "#2ecc71" : parseInt(attendance?.totalPercentage ?? 0) > 60 ? '#686de0' : '#ea2027'}
                        backgroundColor="#ffffff87" />
                    <Text style={{ position: 'absolute', justifyContent: "center", color: 'white', fontSize: 25, fontWeight: '500' }}>{parseInt(attendance?.agg_attendance ?? 0)}%</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '90%',
        height: '80%',
        borderRadius: 25,
        // flexDirection: 'row',
        padding: 10
    },
    detailsContainer: {
        width: '65%',
        borderRadius: 25,
        padding: 8,
        gap: 10,
        // flexDirection: 'row'
        // backgroundColor: '#d4d8dc69',
    },
    details: {
        width: '65%'
    },
    progress: {
        width: "35%",
        justifyContent: 'center',
        alignItems: "center"
    },
    textCourse: {
        fontSize: 18,
        color: '#f5f6fa',
        fontWeight: '500',
    },
    textAttendanceDetails: {
        fontSize: 14,
        color: '#f1ebeb',
        fontWeight: '400'
    },
})