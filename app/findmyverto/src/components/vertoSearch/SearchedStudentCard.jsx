import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { globalStyles } from '../../constants/styles'
import { colors } from '../../constants/colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { API_URL, API_URL_ROOT, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { acceptFriendRequest, cancelSentRequest, rejectFriendRequest, sendFriendRequest } from '../../utils/fetchUtils/handleFriends';


const { height} = Dimensions.get('window');

export default function SearchedStudentCard({ forRequest, student, friends, setfriends, sentFriendRequests, setSentFriendRequests, friendsRequests, setfriendsRequests, navigation, disableBtn, setDisableBtn }) {
    const {auth} = useContext(AuthContext)
    const [isFriend, setIsFriend] = useState(false)
    const [isInRequestList, setIsInRequestList] = useState(false)
    const [isInSentList, setIsInSentList] = useState(false)
    const [loading, setLoading] = useState(false)


    function configureButton() {
        const isStudentInSentList = sentFriendRequests.some(std => std.reg_no === student.reg_no);
        const isStudentInRequestList = friendsRequests.some(std => std.reg_no === student.reg_no);
        const isStudentInFriendList = friends.some(std => std.reg_no === student.reg_no);
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
        configureButton();
    }, [sentFriendRequests, friendsRequests, friends, student]);
    

    function handleSendRequest() {
        sendFriendRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn)
    }

    function handleCancelRequest() {
        cancelSentRequest(auth, student, setSentFriendRequests, sentFriendRequests, setLoading, setDisableBtn)
    }

    function handleAddFriend() {
        acceptFriendRequest(auth, student, setfriendsRequests, friendsRequests, setfriends, friends, setLoading, setDisableBtn)
    }

    function handleRejectFriendRequest() {
        rejectFriendRequest(auth, student, setfriendsRequests, friendsRequests, setLoading, setDisableBtn)
    }


    function navigateToFriend() {
        if(!isFriend){
            Toast.show({
                type:"error",
                text1:"Not your friend!",
                text2:"You have to be friends to see the details"
            })
            return
        }
        navigation.navigate('FriendProfile',student)
    }

    const imageSource = student?.studentPicture ? { uri: `${API_URL_ROOT}${student?.studentPicture}` } : require("../../../assets/icons/profileAvatar.png");


    return (
        <View style={[style.container, globalStyles.elevationMin]}>
            <TouchableOpacity onPress={navigateToFriend} style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                <Image
                    source={imageSource}
                    style={{ height: 60, width: 60, borderRadius: 60 / 2,objectFit:"fill" }}
                    transition={1000}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToFriend} style={{ width: forRequest ? "40%" : "55%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text ellipsizeMode='clip' numberOfLines={1} style={{ fontWeight: "bold" }}>{student.name}</Text>
                <Text style={{fontSize:12,color:"grey"}}>{student.reg_no}</Text>
                <Text style={{fontSize:12,color:"grey"}}>{student.section}</Text>
            </TouchableOpacity>

            {/* Button  */}
            <View style={{ justifyContent: "center", width: forRequest ? "45%" : "30%" }}>
                        <TouchableOpacity
                            disabled={isFriend || disableBtn}
                            onPress={() => {
                                if (isFriend) {
                                    return
                                } else if (isInRequestList) {
                                    navigation.navigate('FriendRequests');
                                } else if (isInSentList) {
                                    handleCancelRequest();
                                } else {
                                    handleSendRequest();
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