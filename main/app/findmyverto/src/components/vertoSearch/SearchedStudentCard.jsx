import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../constants/styles'
import { colors } from '../../constants/colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../../context/Auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';


const { height} = Dimensions.get('window');

export default function SearchedStudentCard({ forRequest, student, friends, setfriends, sentFriendRequests, setSentFriendRequests, friendsRequests, setfriendsRequests, navigation, disableBtn, setDisableBtn }) {
    const [isFriend, setIsFriend] = useState(false)
    const [isInRequestList, setIsInRequestList] = useState(false)
    const [isInSentList, setIsInSentList] = useState(false)
    const [loading, setLoading] = useState(false)


    function configureButton() {
        const isStudentInSentList = sentFriendRequests.some(std => std.registrationNumber === student.registrationNumber);
        const isStudentInRequestList = friendsRequests.some(std => std.registrationNumber === student.registrationNumber);
        const isStudentInFriendList = friends.some(std => std.registrationNumber === student.registrationNumber);
        if (isStudentInSentList) {
            setIsInSentList(true)
        }
        else if (isStudentInRequestList) {
            setIsInRequestList(true)
        }
        else if (isStudentInFriendList) {
            setIsFriend(true)
        }
        else {
            setIsFriend(false)
            setIsInRequestList(false)
            setIsInSentList(false)
        }
    }

    useEffect(() => {
        configureButton()
    }, [])
    useEffect(() => {
        configureButton()
    }, [sentFriendRequests])

    async function sendRequest() {
        setLoading(true)
        setDisableBtn(true)
        await axios.post(`${API_URL}/api/student/sendFriendRequest`, { studentId: student._id })
            .then(async (result) => {
                Toast.show({
                    type: 'success',
                    text1: result.data.msg,
                });
                setSentFriendRequests([...sentFriendRequests, student]);
                setLoading(false);
                setDisableBtn(false)
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err,
                });
                console.log(err);
                setLoading(false)
                setDisableBtn(false)
            })
    }

    async function cancelSentRequest() {
        setLoading(true)
        setDisableBtn(true)
        await axios.post(`${API_URL}/api/student/cancelSentRequest`, { studentId: student._id })
            .then(async (result) => {
                Toast.show({
                    type: 'success',
                    text1: result.data.msg,
                });
                const updatedStudents = sentFriendRequests.filter(std => std.registrationNumber !== student.registrationNumber);
                setSentFriendRequests(updatedStudents);
                setLoading(false);
                setDisableBtn(false)
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err,
                });
                console.log(err);
                setLoading(false)
                setDisableBtn(false)
            })
    }

    async function addFriend() {
        setLoading(true)
        setDisableBtn(true)
        await axios.post(`${API_URL}/api/student/addFriend`, { studentId: student._id })
            .then(async (result) => {
                Toast.show({
                    type: 'success',
                    text1: result.data.msg,
                });
                const updatedStudents = friendsRequests.filter(std => std.registrationNumber !== student.registrationNumber);
                setfriendsRequests(updatedStudents);
                setfriends([...friends, student]);
                setLoading(false);
                setDisableBtn(false)
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err,
                });
                console.log(err);
                setLoading(false)
                setDisableBtn(false)
            })
    }

    async function cancelRequest() {
        setLoading(true)
        setDisableBtn(true)
        await axios.post(`${API_URL}/api/student/removeFromFriendRequest`, { studentId: student._id })
            .then(async (result) => {
                Toast.show({
                    type: 'success',
                    text1: result.data.msg,
                });
                const updatedStudents = friendsRequests.filter(std => std.registrationNumber !== student.registrationNumber);
                setfriendsRequests(updatedStudents);
                setLoading(false);
                setDisableBtn(false)
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: err,
                });
                console.log(err);
                setLoading(false)
                setDisableBtn(false)
            })
    }

    return (
        <View style={[style.container, globalStyles.elevationMin]}>
            <View style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                <Image
                    source={require("../../../assets/icons/profileAvatar.png")}
                    style={{ height: 60, width: 60 }}
                    transition={1000}
                />
            </View>

            <View style={{ width: forRequest ? "40%" : "55%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text ellipsizeMode='clip' numberOfLines={1} style={{ fontWeight: "bold" }}>{student.name}</Text>
                <Text>{student.registrationNumber}</Text>
                <Text>{student.section}</Text>
            </View>

            {/* Button  */}
            <View style={{ justifyContent: "center", width: forRequest ? "45%" : "30%" }}>
                {
                    forRequest ?
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                disabled={disableBtn ? true : isFriend ? true : false}
                                onPress={addFriend}
                                style={{
                                    width: "45%",
                                    borderRadius: 15,
                                    backgroundColor: colors.green,
                                    padding: 10,
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5
                                }}
                            >
                                {loading ? <ActivityIndicator size="small" color={"white"} />
                                    :
                                    <Text style={{ color: "white", fontWeight: '500' }}>Accept</Text>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={disableBtn ? true : isFriend ? true : false}
                                onPress={cancelRequest}
                                style={{
                                    width: "45%",
                                    borderRadius: 15,
                                    backgroundColor: colors.btn1,
                                    padding: 10,
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5
                                }}
                            >
                                {loading ? <ActivityIndicator size="small" color={isInSentList ? "black" : "white"} />
                                    :
                                    <Text style={{ color: "grey", fontWeight: '500' }}>Cancel</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        :

                        // button for all other requests except friendrequests
                        <TouchableOpacity
                            disabled={isFriend ? true : disableBtn ? true : false}
                            onPress={() => {
                                if (isFriend) {
                                    return
                                } else if (isInRequestList) {
                                    navigation.navigate('FriendRequests');
                                } else if (isInSentList) {
                                    cancelSentRequest();
                                } else {
                                    sendRequest();
                                }
                            }}
                            style={{
                                width: "100%",
                                borderRadius: 15,
                                backgroundColor: isFriend ? colors.green : isInRequestList ? colors.orange : isInSentList ? colors.btn1 : colors.lightDark,
                                padding: 10,
                                justifyContent: "center",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5
                            }}
                        >
                            {
                                loading ?
                                    <>
                                        <ActivityIndicator size="small" color={isInSentList ? "black" : "white"} />
                                    </>
                                    :
                                    <>
                                        <Text style={{ color: isInSentList ? "grey" : "white", textAlign: "center", fontWeight: "bold" }}>
                                            {isFriend ? "Friends" : isInRequestList ? "Requested you" : isInSentList ? "Cancel" : "Send"}
                                        </Text>
                                        {
                                            isInSentList ?
                                                <Ionicons name='time' color={"grey"} />
                                                : isInRequestList ?
                                                    <></>
                                                    :
                                                    isFriend ?
                                                        <FontAwesome5 name="user-check" color={"white"} />
                                                        :
                                                        <Ionicons name='person-add-sharp' color={"white"} />
                                        }
                                    </>
                            }
                        </TouchableOpacity>
                }
            </View>

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 10,
        height: height * 0.1,
        width: "96%",
        borderRadius: 15,
        flexDirection: "row"
    }
})