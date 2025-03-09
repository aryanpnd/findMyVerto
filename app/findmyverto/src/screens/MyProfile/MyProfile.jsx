import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Linking, Pressable } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { AuthContext } from '../../../context/Auth'
import StudentProfile from '../../components/Profile/StudentProfile'
import Toast from 'react-native-toast-message'
import SyncData from '../../components/miscellaneous/SyncData'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { fetchBasicDetails } from '../../../utils/fetchUtils/userData/basicDetailsFetch'
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert'
import { HEIGHT, WIDTH } from '../../constants/styles'
import AllowedFieldsToShow from '../../components/settings/AccountSettings/AllowedFieldsToShow'
const { height, width } = Dimensions.get('window');

export default function MyProfile({ navigation }) {
    const { auth, logout } = useContext(AuthContext)
    const customAlert = useCustomAlert();
    const modalRef = useRef();

    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

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
                    text: "Logout",
                    color: colors.red,
                    textColor: "white",
                    onPress: logout
                },
                {
                    text: "Cancel",
                    color: "white",
                    textColor: "black",
                    onPress: () => console.log("Cancel Pressed"),
                }
            ]
        );
    }

    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <CustomAlert />
                <AllowedFieldsToShow ref={modalRef} />
            </View>
            <View style={[styles.container]} >
                <StatusBar style='auto' />
                
                {/* Last sync container */}
                {/* {self && <OverlayLoading loading={loading} loadingText={"Syncing..."} />} */}
                <SyncData color={"grey"} self={true} syncNow={() => handleDataFetch(true)} time={formatTimeAgo(student.lastSynced)} bg={colors.whitePrimary} loader={true} loading={loading} />

                {/* Body */}
                <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center",paddingBottom:HEIGHT(10) }}>
                    <StudentProfile student={student?.data} loading={loading} />

                    <View style={styles.allowedFieldsToShowContainer}>
                        <Pressable style={styles.card} onPress={() => modalRef.current.open()} >
                            <Text style={styles.text1}>Details to show to the friends</Text>
                            <View style={styles.editButton} >
                                <FontAwesome5 name="edit" size={20} color={colors.lightDark} />
                            </View>
                        </Pressable>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleLogout} style={styles.footerBtn}>
                        <Text style={{ color: "grey" }}>Logout</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "grey", marginTop: 10, fontSize: 10 }}>Made with ❤️ by</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/aryanpnd')}>
                            <Text style={{ color: "#5D3FD3", fontSize: 10 }}>Aryan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%',
        height: '100%',
    },

    // Body
    body: {
        width: '100%',
        paddingVertical: 10,
    },
    allowedFieldsToShowContainer: {
        width: "90%",
        marginTop: HEIGHT(2),
        gap: 20,
        padding: WIDTH(5),
        borderRadius: 10,
        backgroundColor: colors.whiteLight
    },
    card: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text1: {
        fontSize: 15,
        fontWeight: "500",
        color: "grey",
    },
    editButton: {
        paddingHorizontal: 10,
        borderRadius: 10
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