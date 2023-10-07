import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5, Octicons } from '@expo/vector-icons'

export default function Header({ userDetails }) {
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

                <View style={styles.classesToday}>
                    <Text style={{fontWeight:'500',color:'grey'}}>Attendance</Text>
                </View>
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
    },
    classesToday: {
        width: '35%', 
        backgroundColor: '#ffffffc9',
        borderRadius:25,
        marginBottom:15,
        alignItems:'center',
        padding:3
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