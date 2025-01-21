import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesome5, Octicons } from '@expo/vector-icons'
import AttendanceProgressBar from '../miscellaneous/AttendanceProgressBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { API_URL, AuthContext } from '../../../context/Auth'
import Toast from 'react-native-toast-message'
import formatTimeAgo from '../../constants/dateFormatter'
import LottieView from 'lottie-react-native';
import { AppContext } from '../../../context/MainApp'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../../constants/colors'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'; // Import the shimmer placeholder

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder


export default function Header({ navigation }) {
    const { auth } = useContext(AuthContext)
    const { setCourses } = useContext(AppContext)
    const [attendance, setattendance] = useState(null)
    const [loading, setLoading] = useState(false)
    const [userDetails, setuserDetails] = useState({})

    useEffect(() => {
        async function fetchDataLocally() {
            try {
                setLoading(true)
                let studentBasicDetails = await AsyncStorage.getItem("STUDENT_BASIC_DETAILS");
                let parsedDetails = studentBasicDetails ? JSON.parse(studentBasicDetails) : null;
                // Check if details exist and are valid
                if (!parsedDetails) {
                    if (!parsedDetails || parsedDetails.status === false) {
                        const result = await axios.post(`${API_URL}/student/basicInfo`, { reg_no: auth.reg_no, password: auth.password });
                        if (result.data.status) {
                            await AsyncStorage.setItem("STUDENT_BASIC_DETAILS", JSON.stringify(result.data));
                            setuserDetails(result.data.data)
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: `${result.data.message}`,
                                text2: `${result.data.errorMessage}`,
                            });
                        }
                    } else {
                        setuserDetails(parsedDetails.data)
                    }
                } else {
                    setuserDetails(parsedDetails.data)
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
        fetchDataLocally();
    }, []);


    // useEffect(() => {
    //     fetchDataLocally();
    // }, []);

    useEffect(() => {
        // fetchDataLocally();
    }, [navigation]);


    return (
        <LinearGradient style={styles.container} colors={[colors.secondary, colors.primary]}>
            <View style={styles.header}>
                <View style={{ height: '20%', alignItems: 'center' }}></View>

                <View style={styles.headerContainer}>
                    <View style={styles.searchbarContainer}>
                        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('VertoSearch')}>
                            <Text style={styles.text1}>Search a Verto</Text>
                            <Octicons name='search' color={colors.whiteLight} size={18} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={{ width: '35%', alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('FriendRequests')}
                                style={styles.button2}><Octicons name='person-add' size={15}
                                    color={colors.whiteLight} /></TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Requests</Text>
                        </View>
                        <View style={{ width: '35%', alignItems: "center" }}>
                            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('MyProfile')}><FontAwesome5 name='user' size={15} color={colors.whiteLight} /></TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Profile</Text>
                        </View>
                    </View>
                </View>

            </View>

            <View style={styles.body}>

                <View style={styles.bodyContainer}>

                    <TouchableOpacity style={styles.greeting}>
                        <Text style={{ fontSize: 20, color: colors.whiteLight, fontWeight: 'bold' }}>Hello,</Text>

                        {loading ? <ShimmerPlaceHolder visible={false} style={[styles.textMedium, styles.shimmerStyles]} /> :
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textMedium}>
                                {loading ? "" : userDetails.studentName}
                            </Text>}

                        <View style={{ flexDirection: loading ? 'column' : "row" }}>
                            {loading ? <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails.reg_no}
                                </Text>}
                            {loading ? <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails.section}
                                </Text>}
                            {loading ? <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails?.rollNumber?.split(userDetails.section)[1]}
                                </Text>}
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.AttendanceContainer} onPress={loading ? () => { } : () => navigation.navigate('Attendance')}>
                        <Text style={{ fontWeight: '500', color: colors.whiteLight }}>Attendance</Text>
                        {loading ?
                            <>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: 50,
                                        height: 50,
                                    }}
                                    source={require('../../../assets/lotties/loading1.json')}
                                />
                            </> :
                            <>
                                <AttendanceProgressBar size={50} attendance={userDetails.attendance ? parseInt(userDetails.attendance) : 0} />
                            </>
                        }
                    </TouchableOpacity>

                </View>

            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40%',
        width: '90%',
    },
    headerContainer: {
        width: '100%',
        justifyContent: 'space-between',
        // backgroundColor:"yellow",
        flexDirection: "row"
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-center',
        height: '55%',
        // backgroundColor:'#00000026',
        backgroundColor: colors.blueTransparency,
        alignItems: 'center',
        marginBottom: 13,
        padding: 10,
        borderRadius: 15,
        // width: '95%'
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor:'red',
        width: '90%'
    },
    searchbarContainer: {
        width: '50%',
        height: '60%',
    },
    greeting: {
        width: '70%',
        overflow: 'hidden',
        paddingLeft: 5
    },
    AttendanceContainer: {
        width: '30%',
        height: 95,
        backgroundColor: colors.btn1,
        borderRadius: 25,
        alignItems: 'center',
        padding: 3,
        gap: 8
    },
    button1: {
        backgroundColor: colors.btn1,
        flex: 1,
        borderRadius: 15,
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    button2: {
        backgroundColor: colors.btn1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: '60%',
        width: "100%"
    },
    iconContainer: {
        width: '35%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    text1: {
        color: colors.whiteLight
    },
    textSmall: { marginRight: 15, fontSize: 15, fontWeight: '400', color: 'white' },
    textMedium: { fontSize: 25, fontWeight: 'bold', color: 'white' },
    shimmerStyles: {
        borderRadius: 5,
        margin:2
    }
})