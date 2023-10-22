import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
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



export default function Header({ userDetails, navigation }) {
    const { auth, logout } = useContext(AuthContext)
    const { setCourses } = useContext(AppContext)
    const [attendence, setattendence] = useState({})
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        async function fetchDataLocally() {
            try {
                setLoading(true)
                let userAttendance = await AsyncStorage.getItem("ATTENDANCE");
                let Courses = await AsyncStorage.getItem("COURSES");
                if (!userAttendance) {
                    await axios.post(`${API_URL}/api/student/getStudentAttendance`, { password: auth.pass }).then(async (result) => {
                        await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data));
                        setattendence(result.data)

                        // fetching courses
                        const courses = {}
                        const aH = result.data.attendanceHistory.slice(0, -1)
                        await aH.map((value) => courses[value.course.split(":")[0]] = value.course.split(":")[1])
                        setCourses(courses)
                        await AsyncStorage.setItem("COURSES", JSON.stringify(courses));

                        setLoading(false)
                    }).catch((err) => {
                        Toast.show({
                            type: 'error',
                            text1: 'Error fetching Attendance',
                            text2: `${err}`,
                        });
                        console.log({ "inside catch": err });
                        setLoading(false)
                    })
                    return
                }
                setLoading(false)
                setattendence(JSON.parse(userAttendance))
                setCourses(JSON.parse(Courses))
            } catch (error) {
                console.error(error);
                setLoading(false)
            }
        }
        fetchDataLocally();

    }, []);


    return (
        <LinearGradient style={styles.container} colors={[colors.blue2,colors.blue]}>

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
                            <TouchableOpacity style={styles.button2}><FontAwesome5 name='user-friends' size={17} color={colors.whiteLight} /></TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 11 }}>Friends</Text>
                        </View>
                        <View style={{ width: '35%', alignItems: "center" }}>
                            <TouchableOpacity style={styles.button2} onPress={logout}><FontAwesome5 name='user' size={17} color={colors.whiteLight} /></TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 11 }}>Profile</Text>
                        </View>
                    </View>
                </View>

            </View>

            <View style={styles.body}>

                <View style={styles.bodyContainer}>

                    <TouchableOpacity style={styles.greeting}>
                        <Text style={{ fontSize: 20, color: colors.whiteLight, fontWeight: 'bold' }}>Hello,</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textMedium}>{userDetails.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>{userDetails.registrationNumber}</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>{userDetails.section}</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>Group: {userDetails.group}</Text>
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
                                <AttendanceProgressBar size={50} attendance={parseInt(attendence?.attendanceHistory?.[attendence.attendanceHistory?.length - 1]?.totalPercentage ?? 0)} />
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
        height: '100%',
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
    headerContainer:{
        width:'100%',
        justifyContent:'space-between',
        // backgroundColor:"yellow",
        flexDirection:"row"
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-center',
        height: '55%',
        // backgroundColor:'#00000026',
        backgroundColor:colors.blueTransparency,
        alignItems:'center',
        marginBottom:13,
        padding:10,
        borderRadius:15,
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
        paddingLeft:5,
    },
    AttendanceContainer: {
        width: '30%',
        height:95,
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
    textMedium: { fontSize: 25, fontWeight: 'bold', color: 'white' }
})