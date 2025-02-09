import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Alert, ActivityIndicator, Linking } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { AuthContext } from '../../../context/Auth'
import StudentProfile from '../../components/Profile/StudentProfile'
import Toast from 'react-native-toast-message'
import SyncData from '../../components/miscellaneous/SyncData'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { fetchBasicDetails } from '../../../utils/fetchUtils/userData/basicDetailsFetch'
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert'
import AllowedFieldsToShow from '../../components/settings/allowedFieldsToShow'
import { AppContext } from '../../../context/MainApp'
const { height, width } = Dimensions.get('window');

export default function MyProfile({ navigation }) {
    const { auth, logout } = useContext(AuthContext)
    const { checkForUpdates } = useContext(AppContext)
    const customAlert = useCustomAlert();

    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleDataFetch = (sync) => {
        fetchBasicDetails(setLoading, setRefreshing, setStudent, auth, setIsError, sync, setLastSynced)
    }

    useEffect(() => {
        handleDataFetch(false)
    }, [])

    const handleLogout = () => {
        customAlert.show(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                },
                { text: "OK", onPress: logout }
            ]
        );
    }

    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <CustomAlert />
            </View>
            <SafeAreaView style={[styles.container]} >

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
                    </View>

                </View>



                {/* Last sync container */}
                {/* {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} />} */}
                <SyncData color={"white"} self={true} syncNow={() => handleDataFetch(true)} time={formatTimeAgo(student.lastSynced)} bg={colors.secondary} loader={true} loading={loading} />

                {/* Body */}
                <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center" }}>
                    <StudentProfile student={student?.data} loading={loading} />
                    <AllowedFieldsToShow />

                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleLogout} style={styles.footerBtn}>
                        <Text style={{ color: "grey" }}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => checkForUpdates(setUpdateLoading, CustomAlert)} style={{ marginTop: 10 }}>
                        {updateLoading ?
                            <ActivityIndicator color={"grey"} size={20} /> :
                            <Text style={{ color: "grey" }}>Check for updates</Text>}
                    </TouchableOpacity>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "grey", marginTop: 10,fontSize:10 }}>Made with ❤️ by</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/aryanpnd')}>
                            <Text style={{ color: "#5D3FD3",fontSize:10 }}>Aryan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        // height: '100%',
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
        height: height * 0.15,
        alignItems: "center"
    },
    footerBtn: {
        width: width * 0.8,
        height: height * 0.05,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 1
    }

})