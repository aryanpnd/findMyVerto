import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { globalStyles, HEIGHT } from '../../constants/styles'
import ButtonV1 from '../miscellaneous/buttons/ButtonV1'

export default function AttendanceCard({ attendance, colors, navigation, isAggregateCard, attendanceDetails }) {
    return (
        <ButtonV1 bounce={attendance?.subject_name? true : false}
            style={[
                styles.cardWrapper,
                !attendance?.subject_name && { borderBottomRightRadius: 50, borderTopLeftRadius: 50 }
            ]}
            onPress={
                attendance?.subject_name ?
                    () => navigation.navigate('AttendanceDetails', { Details: attendanceDetails, subject_code: attendance.subject_code })
                    : () => { }
            }>
            <LinearGradient
                colors={colors}
                style={[
                    styles.cardContainer,
                    globalStyles.elevationMin,
                    !attendance?.subject_name && { borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }
                ]}
                start={{ x: 0, y: 0 }} // Start from the left
                end={{ x: 1, y: 0 }}
            >
                <Text style={[styles.textCourse, { marginLeft: 10 }]}>{
                    attendance?.subject_name ? `${attendance.subject_code}: ${attendance.subject_name}` : "Aggregate Attendance"
                }</Text>

                <View style={{ maxHeight: HEIGHT(13), flexDirection: 'row' }}>

                    <View style={styles.detailsContainer}>

                        <View style={{ height: "100%", justifyContent: "space-evenly", paddingLeft: 5 }}>
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
        </ButtonV1>
    )
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: '95%',
        // height: '100%',
        borderRadius: 25,
        // flexDirection: 'row',
    },
    cardContainer: {
        width: '100%',
        // height: '100%',
        borderRadius: 25,
        gap: 5,
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
        fontSize: 17,
        color: '#f5f6fa',
        fontWeight: '500',
    },
    textAttendanceDetails: {
        fontSize: 13,
        color: '#f1ebeb',
        fontWeight: '400'
    },
})