import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Image, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext, useEffect, useState } from 'react';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import LottieView from 'lottie-react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import StudentCard from '../../components/vertoSearch/SearchedStudentCard';
import { searchStudents } from '../../utils/fetchUtils/searchStudents';


const { height, width } = Dimensions.get('window');

export default function VertoSearch({ navigation }) {
    const { auth } = useContext(AuthContext)
    const [query, setQuery] = useState("")
    const [search, setSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isFocused, setFocused] = useState(false);
    const [students, setStudents] = useState([])
    const [friends, setfriends] = useState([])
    const [friendsRequests, setfriendsRequests] = useState([])
    const [sentFriendRequests, setSentFriendRequests] = useState([])
    const [disableBtn, setDisableBtn] = useState(false)

    async function handleSearchStudents() {
        if (query.length < 2) {
            Toast.show({
                type: 'error',
                text1: 'Search query must be greater than 2',
            })
            return
        }
        Keyboard.dismiss()
        await searchStudents(auth, query, setSearch, setLoading, setStudents, setfriends, setfriendsRequests, setSentFriendRequests)
        // setQuery("")
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={{ zIndex: 2 }}>
                <Toast />
            </View>
            <View style={[styles.header]}>

                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>

                {/* Search input */}
                <TextInput
                    onChangeText={(text) => setQuery(text)}
                    style={[styles.searchBar, {
                        width: isFocused && query.length > 2 ? "80%" : "90%",
                        borderColor: isFocused ? colors.lightDark : 'transparent',
                        backgroundColor: isFocused ? "transparent" : colors.btn1,
                    }]}
                    placeholder={isFocused ? "" : 'Search in name, section, or registration number '}
                    placeholderTextColor={"grey"}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onSubmitEditing={handleSearchStudents}
                />

                {/* search button */}
                <View style={[styles.backBtn, { display: isFocused && query.length > 2 ? "flex" : "none" }]}>
                    <TouchableOpacity onPress={handleSearchStudents}>
                        <FontAwesome5 name='arrow-right' size={20} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                {/* students found container */}
                {
                    search && !loading &&
                    <View style={styles.studentsFoundContainer}>
                        <Text style={styles.text2}>Students found</Text>
                        <Text style={styles.text2}>{students.length}</Text>
                    </View>
                }

                <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%", }} contentContainerStyle={{ alignItems: "center", gap: 8, paddingVertical: 10 }}>
                    {search ?
                        loading ?
                            // Loadinf animation
                            <View style={{ height: height * 0.7, justifyContent: "center" }}>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: width,
                                        height: width,
                                        opacity: 0.8
                                    }}
                                    source={require('../../../assets/lotties/searchAnim.json')}
                                />
                                <Text style={styles.text1}>Looking for them...</Text>
                            </View>
                            :
                            students.length < 1 ?
                                // no result found container
                                <View style={{ height: height * 0.7, justifyContent: "center" }}>
                                    <LottieView
                                        autoPlay
                                        style={{
                                            width: width,
                                            height: width,
                                            opacity: 0.8
                                        }}
                                        source={require('../../../assets/lotties/notfound.json')}
                                    />
                                    <Text style={styles.text1}>No student has found matching your query</Text>
                                    <Text style={styles.text1}>Please check your query again</Text>
                                    <Text style={styles.text1}>or</Text>
                                    <Text style={styles.text1}>Maybe he/she has not yet login on this app</Text>
                                </View>
                                :
                                // results mapping
                                students.map((value, index) => (
                                    //searched students cards mapping
                                    value.reg_no !== auth.reg_no && <StudentCard
                                        key={index} student={value}
                                        friends={friends} setfriends={setfriends}
                                        friendsRequests={friendsRequests} setfriendsRequests={setfriendsRequests}
                                        sentFriendRequests={sentFriendRequests} setSentFriendRequests={setSentFriendRequests}
                                        navigation={navigation}
                                        disableBtn={disableBtn} setDisableBtn={setDisableBtn}
                                    />
                                ))
                        :

                        // search vector image
                        <View style={{ alignItems: "center", height: height * 0.8, justifyContent: "center", gap: 20 }}>
                            <Image
                                source={require("../../../assets/vectorArts/searchPeople.png")}
                                style={{ height: width * 0.7, width: width * 0.9, opacity: 0.3 }}
                                transition={1000}
                            />
                            <Text style={styles.text1}>Search in Student's name, Section, or registration number</Text>
                        </View>
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
        justifyContent: "space-between"
    },
    backBtn: {
        width: "10%",
        justifyContent: "center",
        alignItems: 'center',
    },
    searchBar: {
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15
    },

    // body
    body: {
        height: "92%",
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
    studentsFoundContainer: {
        // backgroundColor:"red",
        width: "100%",
        paddingHorizontal: 20,
        height: height * 0.05,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },

    // miscellaneous
    text1: { fontSize: 12, textAlign: "center", color: "grey" },
    text2: { fontSize: 15, fontWeight: "500", color: colors.lightDark }
})
