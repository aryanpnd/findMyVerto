import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL, AuthContext } from '../../../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import StudentProfile from '../../components/Profile/StudentProfile';
import OverlayLoading from '../../components/miscellaneous/OverlayLoading';
// import { MMKV } from 'react-native-mmkv';
import formatTimetable from '../../utils/helperFunctions/timetableFormatter';
import { getFriendDetails } from '../../utils/fetchUtils/handleFriendsData';
import SyncData from '../../components/miscellaneous/SyncData';
import formatTimeAgo from '../../utils/helperFunctions/dateFormatter';
// import { mmkvStorage } from '../../../context/MainApp';


const { height, width } = Dimensions.get('window');

const navigations = [
    {
        title: "Attendance",
        icon: require('../../../assets/icons/attendance.png'),
        route: "FriendAttendance"
    },
    {
        title: "Timetable",
        icon: require('../../../assets/icons/schedule.png'),
        route: "FriendTimetable"
    },
]

export default function FriendProfile({ navigation, route }) {
    const { _id, } = route.params;

    const { auth } = useContext(AuthContext)
    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(true)

    function handleFetchData() {
        getFriendDetails(auth, _id, setStudent, setLoading)
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            // let user = mmkvStorage.getString(`${_id}`);
            const studentRaw = await AsyncStorage.getItem(`${_id}`);
            console.log(JSON.stringify(studentRaw));

            if (studentRaw) {
                const student = JSON.parse(studentRaw)
                setStudent(student)
            } else {
                handleFetchData()
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${error.message}`
            });
        }
    }

    useEffect(() => {
        fetchDataLocally()
    }, [])

    return (
        <SafeAreaView style={[styles.container]} >
            <Toast />
            <StatusBar style='auto' />

            <OverlayLoading loadAnim={""} loading={loading} loadingText={"Loading..."} loadingMsg={"Getting your Friend's data"} />

            <View style={[styles.header]}>
                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* title */}
                <View style={[styles.title]}>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>Friend</Text>
                </View>

                {/* Logout */}
                <View style={[styles.backBtn]}>

                </View>

            </View>
            <View style={{ marginBottom: 20 }}>
                <SyncData self={false} time={formatTimeAgo(student.lastSync)} color={"grey"} bg={colors.whitePrimary} />
            </View>

            {/* Body */}
            <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center", gap: height * 0.05 }}>
                <StudentProfile student={student} />
                <View style={styles.NavigationsContainer}>
                    {
                        navigations.map((value) => (
                            <Pressable
                                onPress={() => navigation.navigate(value.route, { _id: _id })}
                                key={value.title} style={styles.NavigationsCard} >
                                <Image
                                    source={value.icon}
                                    style={{ height: width * 0.12, width: width * 0.12 }}
                                    transition={1000}
                                />
                                <Text style={styles.text2}>{value.title}</Text>
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    // header
    header: {
        height: 0.08 * height,
        width: '100%',
        flexDirection: "row",
        padding: 10,
        gap: width * 0.02,
        justifyContent: "space-between"
    },
    title: {
        alignItems: "center",
        justifyContent: "center"
    },
    backBtn: {
        width: "10%",
        justifyContent: "center",
        alignItems: 'center',
    },


    // Body
    body: {
        width: '100%',
    },

    NavigationsContainer: {
        width: "90%",
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    NavigationsCard: {
        backgroundColor: "white",
        height: height * 0.14,
        width: width * 0.28,
        borderRadius: 20,
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    text1: {
        color: colors.lightDark,
        fontSize: 14,
        fontWeight: '500'
    },

    text2: {
        color: "grey",
        fontSize: 14,
        fontWeight: '500'
    }
})