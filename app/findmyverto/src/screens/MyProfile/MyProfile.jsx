import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { API_URL, AuthContext } from '../../../context/Auth'
import StudentProfile from '../../components/Profile/StudentProfile'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import SyncData from '../../components/miscellaneous/SyncData'
import formatTimeAgo from '../../constants/dateFormatter'
import OverlayLoading from '../../components/miscellaneous/OverlayLoading'

const { height, width } = Dimensions.get('window');

export default function MyProfile({ navigation }) {
    const { auth, logout, logout2 } = useContext(AuthContext)

    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    async function fetchData() {
        try {
            setLoading(true)
            const result = await axios.post(`${API_URL}/student/basicInfo`, { reg_no: auth.reg_no, password: auth.password });
            if (result.data.status) {
                await AsyncStorage.setItem("STUDENT_BASIC_DETAILS", JSON.stringify(result.data));
                setStudent(result.data)
                Toast.show({
                    type: 'success',
                    text1: `${result.data.message}`
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: `${result.data.message}`,
                    text2: `${result.data.errorMessage}`,
                });
            }
            setLoading(false)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error fetching Details',
                text2: `${err.message}`,
            });
            console.error(error.message);
            setLoading(false)
        }
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            let user = await AsyncStorage.getItem("STUDENT_BASIC_DETAILS");
            if (!user) {
                fetchData()
                setLoading(false)
                return
            }
            setStudent(JSON.parse(user))
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
            <View style={[styles.header]}>
                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* title */}
                <View style={[styles.title]}>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>My Profile</Text>
                </View>

                {/* Logout */}
                <View style={[styles.backBtn]}>
                    {/* <TouchableOpacity onPress={logout}>
                        <MaterialIcons name='logout' size={25} color={colors.lightDark} />
                    </TouchableOpacity> */}
                </View>

            </View>



            {/* Last sync container */}
            {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} loadingMsg={"please wait, it may take a few seconds"} />}
            <SyncData color={"white"} self={true} syncNow={() => fetchData()} time={formatTimeAgo(student.requestTime)} bg={colors.secondary} />

            {/* Body */}
            <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center" }}
            // refreshControl={
            //     <RefreshControl
            //         tintColor={colors.secondary}
            //         colors={[colors.secondary]}
            //         refreshing={refreshing}
            //         onRefresh={() => {
            //             fetchData()
            //         }}
            //     />
            // }
            >
                <StudentProfile student={student?.data} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={logout} style={styles.footerBtn}>
                    <Text style={{ color: "grey" }}>Logout</Text>
                </TouchableOpacity>
            </View>
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
        paddingVertical: 10,
    },

    footer: {
        height: height * 0.1,
        alignItems: "center"
    },
    footerBtn: {
        width: width * 0.8,
        height: height * 0.05,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.blueTransparency,
        borderWidth: 2
    }

})