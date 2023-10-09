import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesome5, Octicons } from '@expo/vector-icons'
import AttendanceProgressBar from '../miscellaneous/AttendanceProgressBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { API_URL, AuthContext } from '../../../context/Auth'
import Toast from 'react-native-toast-message'


export default function Header({ userDetails, navigation }) {
    const { auth } = useContext(AuthContext)
    const [attendence, setattendence] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchDataLocally() {
            try {
                setLoading(true)
                let userAttendance = await AsyncStorage.getItem("ATTENDANCE");
                if (!userAttendance) {
                    await axios.post(`${API_URL}/api/student/getStudentAttendance`, { regNo: auth.regNo, password: auth.pass }).then(async (result) => {
                        await AsyncStorage.setItem("ATTENDANCE", JSON.stringify(result.data))
                        setattendence(result.data)
                        //   console.log(result.data);
                        setLoading(false)
                        //   console.log({ "inside if then": result });
                    }).catch((err) => {
                        Toast.show({
                            type: 'error',
                            text1: 'Login failed',
                            text2: `${err}`,
                        });
                        console.log({ "inside catch": err });
                        setLoading(false)
                    })
                    setLoading(false)
                    return
                }
                setLoading(false)
                setattendence(JSON.parse(userAttendance))
            } catch (error) {
                console.error(error);
                setLoading(false)
            }
        }
        fetchDataLocally();

    }, []);


    return (
        <View style={styles.container}>
            <View style={{ height: '20%', alignItems: 'center' }}><Text style={{ color: "whitesmoke", fontSize: 20, fontWeight: '600' }}>FindMyVerto</Text></View>

            <View style={styles.header}>
                <View style={styles.searchbarContainer}>
                    <TouchableOpacity style={styles.button1}>
                        <Text style={styles.text1}>Search a Verto</Text>
                        <Octicons name='search' color={'#ffffffb5'} size={18} />
                    </TouchableOpacity></View>
                <View style={styles.iconContainer}>
                    <View style={{ width: '35%', alignItems: "center" }}>
                        <TouchableOpacity style={styles.button2}><FontAwesome5 name='user-friends' size={17} color={'#ffffffb5'} /></TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 11 }}>Friends</Text>
                    </View>
                    <View style={{ width: '35%', alignItems: "center" }}>
                        <TouchableOpacity style={styles.button2}><FontAwesome5 name='user' size={17} color={'#ffffffb5'} /></TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 11 }}>Profile</Text>
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.greeting}>
                    <Text style={{ fontSize: 20, color: '#ffffffb5', fontWeight: 'bold' }}>Hello,</Text>
                    <Text style={{ fontSize: 40, fontWeight: '500', color: 'white' }}>{userDetails.name?.split(" ")[0]}</Text>
                </View>

                <TouchableOpacity style={styles.classesToday} onPress={loading?()=>{}:() => navigation.navigate('Attendance')}>
                    {loading ?
                        <>
                            <Text>Loading...</Text>
                        </> :
                        <>
                            <Text style={{ fontWeight: '500', color: '#ffffffb5' }}>Attendance</Text>
                            <AttendanceProgressBar size={50} attendance={parseInt(attendence?.attendanceHistory?.[attendence.attendanceHistory?.length - 1]?.totalPercentage ?? 0)} />
                        </>
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        height: '100%',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '35%',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '45%'
    },
    searchbarContainer: {
        width: '50%',
        height: '60%'
    },
    greeting: {
        width: '50%',
        overflow: 'hidden',
        height: '80%',
    },
    classesToday: {
        width: '35%',
        backgroundColor: '#d4d8dc69',
        borderRadius: 25,
        marginBottom: 15,
        alignItems: 'center',
        padding: 3,
        gap: 8
    },
    button1: {
        backgroundColor: '#d4d8dc69',
        flex: 1,
        borderRadius: 15,
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    button2: {
        backgroundColor: '#d4d8dc69',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: '60%',
        width: "100%"
    },
    iconContainer: {
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
    text1: {
        color: '#ffffffb5'
    }
})