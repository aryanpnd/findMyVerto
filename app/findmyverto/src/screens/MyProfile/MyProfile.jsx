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
    const { auth, logout,logout2 } = useContext(AuthContext)

    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    async function fetchData(sync) {
        setLoading(true)
        setRefreshing(true)
        console.log(auth);
        
        await axios.post(`${API_URL}/api/student/getStudentInfo`, { password: auth.pass, sync: sync ? true : false }).then(async (result) => {
            await AsyncStorage.setItem("USER", JSON.stringify(result.data.data))
            setStudent(result.data.data)
            console.log({ "inside then": result.data.data });
            setLoading(false)
            setRefreshing(false)
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: `${err}`,
            });
            if (sync) {
                Alert.alert('Logout', 'Due to error while syncing your data from the UMS server you have been logout, This because you might have changed your UMS password or it has been expired, try it again after logging with your new password, if it still happens then it would be something from our end, try it after some time :) ', [
                    { text: 'Okay', onPress: async () => logout2() },
                ]);
            }
            console.log({ "inside catch": err });
            setLoading(false)
            setRefreshing(false)
        })
        return
    }

    async function fetchDataLocally() {
        try {
            setLoading(true)
            let user = await AsyncStorage.getItem("USER");
            if (!user) {
                fetchData(false)
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
            {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} loadingMsg={"please wait, It may take some minutes"} />}
            <SyncData color={"white"} self={true} syncNow={() => fetchData(false)} time={formatTimeAgo(student.lastSync)} bg={colors.secondary} />

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
                <StudentProfile student={student} />
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