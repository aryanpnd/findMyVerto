import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import SyncData from '../../components/miscellaneous/SyncData';
import formatTimeAgo from '../../constants/dateFormatter';
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

    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(true)

    async function fetchData(sync) {
        setLoading(true)
        await axios.post(`${API_URL}/api/student/getFriendData`, { studentId: _id }).then(async (result) => {
            await AsyncStorage.setItem(`${_id}`, JSON.stringify(result.data))
            setStudent(result.data.studentInfo)
            setLoading(false)
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: `${err}`,
            });
            console.log({ "inside catch": err });
            setLoading(false)
        })
        return
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            let user = await AsyncStorage.getItem(`${_id}`);
            if (!user) {
                fetchData(false)
                setLoading(false)
                return
            }
            const studentParsed = JSON.parse(user)
            setStudent(studentParsed.studentInfo)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
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


            {/* Body */}
            <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center",gap:height*0.05 }}>
                <StudentProfile student={student} />
                <View style={styles.NavigationsContainer}>
                    {
                        navigations.map((value) => (
                            <Pressable
                                onPress={() => navigation.navigate(value.route,{_id:_id})}
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
        alignItems:"center"
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