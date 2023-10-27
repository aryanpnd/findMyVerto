import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../../context/Auth'
import axios from 'axios'
import SearchedStudentCard from '../../components/vertoSearch/SearchedStudentCard'
import LottieView from 'lottie-react-native';
import EmptyRequests from '../../components/miscellaneous/EmptyRequests'
import { StatusBar } from 'expo-status-bar'


const { height, width } = Dimensions.get('window');

export default function Friends({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [isFocused, setFocused] = useState(false);

    const [friends, setfriends] = useState([])
    const [updatedFriends, setupdatedFriends] = useState([])
    const [friendsRequests, setfriendsRequests] = useState([])
    const [sentFriendRequests, setSentFriendRequests] = useState([])
    const [disableBtn, setDisableBtn] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const updateSearchQuery = (text) => {
        const lowerCaseQuery = text.toLowerCase(); 

        setSearchQuery(text);

        const filteredFriends = friends.filter((friend) => {
            return (
                friend.name.toLowerCase().includes(lowerCaseQuery) ||
                friend.registrationNumber.toLowerCase().includes(lowerCaseQuery) ||
                friend.section.toLowerCase().includes(lowerCaseQuery)
            );
        });

        setupdatedFriends(filteredFriends);
    };


    async function getFriendListLocal() {
        try {
            setLoading(true)
            let friendsLocally = await AsyncStorage.getItem("FRIENDS");
            if (!friendsLocally) {
                getFriendList()
                setLoading(false)
            } else {
                setfriends(JSON.parse(friendsLocally))
                setupdatedFriends(JSON.parse(friendsLocally))
                setLoading(false)
            }
        } catch (e) {
            console.error(error);
            setLoading(false)
        }
    }

    async function getFriendList() {
        setLoading(true)
        setRefreshing(true)
        await axios.post(`${API_URL}/api/student/getFriendList`)
            .then(async (result) => {
                setfriends(result.data.friends)
                setupdatedFriends(result.data.friends)
                await AsyncStorage.setItem("FRIENDS", JSON.stringify(result.data.friends));
                setLoading(false)
                setRefreshing(false)
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error loading friends',
                    text2: `${err}`,
                });
                console.log(err);
                setLoading(false)
                setRefreshing(false)
                return
            })
    }

    useEffect(() => {
        getFriendListLocal()
    }, [])


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <StatusBar style='auto'/>
            <View style={[styles.header]}>
                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* title */}
                <View style={[styles.title]}>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>Friends</Text>
                </View>
            </View>

            {/* Body */}
            <View style={styles.body}>
                {/* Search bar */}
                <TextInput
                    style={[styles.searchBar, {
                        borderColor: isFocused ? colors.lightDark : 'transparent',
                        backgroundColor: isFocused ? "transparent" : colors.btn1,
                    }]}
                    placeholder={isFocused ? "" : 'Search in name, section, or registration number '}
                    placeholderTextColor={"grey"}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    value={searchQuery}
                    onChangeText={updateSearchQuery}
                />

                {/* Total friends container */}
                <View style={styles.totalFriendsContainer}>
                    <Text style={styles.text2}>Total friends: {friends.length}</Text>
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.blue2}
                            colors={[colors.blue2]}
                            refreshing={refreshing}
                            onRefresh={() => getFriendList()}
                        />
                    }
                    contentContainerStyle={{ alignItems: "center", paddingVertical: 15, gap: height * 0.01 }}>
                    {
                        updatedFriends.length < 1 ?
                            <EmptyRequests navigation={navigation} btnText={"Find Friends"} withButton={true} text={"You have 0 friends right now"} route={"VertoSearch"} />
                            :
                            updatedFriends.map((value, index) => (
                                <SearchedStudentCard key={index} setfriends={setfriends} friends={friends} disableBtn={disableBtn} friendsRequests={friendsRequests} setfriendsRequests={setfriendsRequests} sentFriendRequests={sentFriendRequests} navigation={navigation} setDisableBtn={setDisableBtn} setSentFriendRequests={setSentFriendRequests} student={value} />
                            ))
                    }
                </ScrollView>

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
        gap: width * 0.02
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
        height: "92%",
        width: '100%',
        alignItems: "center",
        paddingVertical: 10
        // backgroundColor: "red"
    },

    searchBar: {
        width: "90%",
        height: height * 0.07,
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15
    },

    totalFriendsContainer: {
        width: "90%",
        height: height * 0.08,
        justifyContent: "center",
    },

    // miscellaneous
    text1: { fontSize: 16, textAlign: "center", fontWeight: "500", color: "grey" },
    text2: { fontSize: 18, fontWeight: "500", color: colors.lightDark }
})
