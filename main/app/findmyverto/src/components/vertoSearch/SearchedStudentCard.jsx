import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../constants/styles'
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function SearchedStudentCard({ student, friends, sentFriendRequests }) {
    const [isFriend, setIsFriend] = useState(false)
    const [isInSentList, setIsInSentList] = useState(false)

    function configureButton() {
        const isStudentInSentList = sentFriendRequests.some(std => std.registrationNumber === student.registrationNumber);
        const isStudentInFriendList = friends.some(std => std.registrationNumber === student.registrationNumber);
        if (isStudentInSentList) {
            setIsInSentList(true)
        }
        if (isStudentInFriendList) {
            setIsFriend(true)
        }
    }

    useEffect(() => {
        configureButton()
    }, [])

    return (
        <View style={[style.container, globalStyles.elevationMin]}>
            <View style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                <Image
                    source={require("../../../assets/icons/profileAvatar.png")}
                    style={{ height: 60, width: 60 }}
                    transition={1000}
                />
            </View>

            <View style={{ width: "65%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text ellipsizeMode='clip' style={{ fontWeight: "bold" }}>{student.name}</Text>
                <Text>{student.registrationNumber}</Text>
                <Text>{student.section}</Text>
            </View>

            <View style={{ width: "20%", justifyContent: "center" }}>
                <TouchableOpacity style={{
                    width: "100%",
                    borderRadius: 15,
                    backgroundColor: isFriend?colors.green:isInSentList?colors.btn1:colors.lightDark,
                    padding: 10,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5
                }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        {isFriend ? "Friends" : isInSentList ? "Pending" : "Add"}
                    </Text>
                    {
                        isInSentList ?
                            <Ionicons name='time' color={"white"} />
                            :
                            isFriend ?
                                <></>
                                :
                                <Ionicons name='person-add-sharp' color={"white"} />
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
        width: "93%",
        borderRadius: 15,
        flexDirection: "row"
    }
})