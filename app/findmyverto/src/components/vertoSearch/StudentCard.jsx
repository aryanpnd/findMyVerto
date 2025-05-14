import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { blurHash, globalStyles, WIDTH } from '../../constants/styles'
import { colors } from '../../constants/colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { acceptFriendRequest, cancelSentRequest, rejectFriendRequest, removeFriend, sendFriendRequest } from '../../../utils/fetchUtils/handleFriends/handleFriends';
import ImageViewer from '../miscellaneous/ImageViewer';
import CustomAlert, { useCustomAlert } from '../miscellaneous/CustomAlert';
import { AppContext } from '../../../context/MainApp';
import { Image } from 'expo-image';
import ButtonV1 from '../miscellaneous/buttons/ButtonV1';


const { height } = Dimensions.get('window');

export default function StudentCard({ 
    forRequest,
    student,
    friends, 
    setfriends, 
    sentFriendRequests, 
    setSentFriendRequests, 
    friendsRequests, 
    setfriendsRequests, 
    navigation, 
    disableBtn, 
    setDisableBtn, 
    elevation=true
}) {
    const customAlert = useCustomAlert()
    const { auth } = useContext(AuthContext)
    const { friendsRefreshing, setFriendsRefreshing, friendRequests, setFriendRequests } = useContext(AppContext)

    const studentFirstName = student.name.split(" ")[0]
    const [isFriend, setIsFriend] = useState(false)
    const [isInRequestList, setIsInRequestList] = useState(false)
    const [isInSentList, setIsInSentList] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    // const imageSource = { uri: student?.studentPicture }

    const imageSource = student?.studentPicture
        ? { uri: student?.studentPicture }
        : require("../../../assets/icons/profileAvatar.png");

    function configureButton() {
        const isStudentInSentList = sentFriendRequests?.some(std => std.reg_no === student.reg_no);
        const isStudentInRequestList = friendsRequests?.some(std => std.reg_no === student.reg_no);
        const isStudentInFriendList = friends?.some(std => std.reg_no === student.reg_no);
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
        acceptFriendRequest(auth, student, setfriends, friends, setfriendsRequests, friendsRequests, friendRequests, setFriendRequests, setLoading, setDisableBtn)
    }

    function handleRejectFriendRequest() {
        rejectFriendRequest(auth, student, setfriendsRequests, friendsRequests, setLoading, setDisableBtn)
    }

    async function handleRemoveFriend() {
        customAlert.show(
            `Remove ${studentFirstName}?`,
            `Are you sure you want to remove ${studentFirstName} as a friend?`,
            [
                {
                    text: 'Remove',
                    color: colors.red,
                    textColor: "white",
                    onPress: async () => {
                        const removeStatus = await removeFriend(auth, student._id, setLoading)
                        if (removeStatus) {
                            setfriends(prev => prev.filter(friend => friend._id !== student._id));
                            setFriendsRefreshing(!friendsRefreshing)
                        }
                    }
                },
                {
                    text: 'Cancel',
                    color: "white",
                    textColor: "black",
                    onPress: () => { }
                }
            ]
        )
    }

    function navigateToFriend() {
        if (!isFriend) {
            Toast.show({
                type: "error",
                text1: "Not your friend!",
                text2: "You have to be friends to see the details"
            })
            return
        }
        navigation.navigate('FriendProfile', student)
    }

    return (
        <View style={[style.container, elevation && globalStyles.elevationMin]}>
            <CustomAlert />
            <ImageViewer visible={modalVisible} setVisible={setModalVisible} image={imageSource} />
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                <Image
                    source={imageSource}
                    style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                    placeholder={{ blurhash: blurHash }}
                    contentFit="contain"
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToFriend} style={{ width: forRequest ? "35%" : "55%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text ellipsizeMode='clip' numberOfLines={1} style={{ fontWeight: "bold" }}>{student.name}</Text>
                <Text style={{ fontSize: 12, color: "grey" }}>{student.reg_no}</Text>
                <Text style={{ fontSize: 12, color: "grey" }}>{student.section}</Text>
            </TouchableOpacity>

            {/* Button  */}
            <View style={{ justifyContent: "center", width: forRequest ? "45%" : "30%" }}>
                {
                    forRequest ?
                        <View style={{ flexDirection: "row", width: WIDTH(43), justifyContent: 'space-between' }}>
                            <ButtonV1
                                scaleInValue={0.90}
                                disabled={disableBtn ? true : isFriend ? true : false}
                                onPress={handleAddFriend}
                                style={[style.acceptAndRejectBtn, { backgroundColor: colors.green }]}
                                loading={loading}
                                spinnerColor={isInSentList ? "black" : "white"}
                            >
                                <Text style={{ color: "white", fontWeight: '500' }}>Accept</Text>

                            </ButtonV1>

                            <ButtonV1
                                scaleInValue={0.90}
                                disabled={disableBtn ? true : isFriend ? true : false}
                                onPress={handleRejectFriendRequest}
                                style={[style.acceptAndRejectBtn, { backgroundColor: colors.btn1 }]}
                                loading={loading}
                                spinnerColor={isInSentList ? "black" : "white"}
                            >
                                <Text style={{ color: "grey", fontWeight: '500' }}>Cancel</Text>

                            </ButtonV1>
                        </View>
                        :
                        <ButtonV1
                            scaleInValue={0.90}
                            disabled={disableBtn}
                            disabledBackground='transparent'
                            onPress={() => {
                                if (isFriend) {
                                    handleRemoveFriend();
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
                                backgroundColor: isFriend ? colors.green : isInRequestList ? colors.orange : isInSentList ? colors.btn1 : colors.secondary,
                                padding: 10,
                                justifyContent: "center",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5
                            }}
                            loading={loading}
                            spinnerColor={isInSentList ? "black" : "white"}
                        >
                            <View style={style.buttonChildContainer}>
                                <Text style={[style.buttonText, { color: isInSentList ? "grey" : "white" }]}>
                                    {
                                        isFriend ?
                                            "Friends" :
                                            isInRequestList ?
                                                "Requested" :
                                                isInSentList ?
                                                    "Cancel" : "Send"}
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
                            </View>
                        </ButtonV1>
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
        // width: "97%",
        borderRadius: 15,
        flexDirection: "row"
    },
    acceptAndRejectBtn: {
        width: WIDTH(20),
        borderRadius: 15,
        padding: 10,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    buttonChildContainer: {
        width: "100%",
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        textAlign: "center",
    }
})