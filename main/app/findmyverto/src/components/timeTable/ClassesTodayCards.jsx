import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../../../context/MainApp';
import isTimeEqual from '../../constants/funtions';
import { colors } from '../../constants/colors';
import { globalStyles } from '../../constants/styles';


const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function ClassesTodayCards({ value,index }) {
    const { courses } = useContext(AppContext)

    return (
        <LinearGradient
            colors={isTimeEqual(value[0]) ? ['#11998e', '#32cf6d'] : ["white", "transparent"]}
            style={[styles.cardContainer, globalStyles.elevationMin]}
            start={{ x: 0, y: 0 }} // Start from the left
            end={{ x: 1, y: 0 }}
        >


            {/* Course name */}
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center'}}>
                <Text numberOfLines={2} style={[isTimeEqual(value[0]) ? styles.text2 : styles.text1, { fontWeight: 'bold', fontSize: 14 }]}>
                {index+1}. {"("}{value[1]?.split("/")[1].split(" ")[2].split(":")[1]}{")"}  {courses[value[1]?.split("/")[1].split(" ")[2].split(":")[1]]}
                </Text>
            </View>

            {/* time and building */}
            <View style={styles.cardElementsContainer}>
                {value && value[0] && (
                    <View style={[styles.cardElements,{backgroundColor: isTimeEqual(value[0]) ? colors.orange :colors.btn1}]}>
                        <Image
                            source={require("../../../assets/icons/clock.png")}
                            style={{ height: 20, width: 20 }}
                            transition={1000}
                        />
                        <Text numberOfLines={2} style={[isTimeEqual(value[0]) ? styles.text2 : styles.text1,{ fontWeight: "500" }]}>
                            {isTimeEqual(value[0]) ? "Ongoing" : value[0]}
                        </Text>
                    </View>
                )}
                {value && value[1] && value[1].split("/") && value[1].split("/")[2] && (
                    <View style={[styles.cardElements,{backgroundColor: isTimeEqual(value[0]) ? colors.blueTransparency : "",},]}>
                        <Image
                            source={require("../../../assets/icons/building.png")}
                            style={{ height: 20, width: 20 }}
                            transition={1000}
                        />
                        <Text numberOfLines={2} style={[isTimeEqual(value[0]) ? styles.text2 : styles.text1,]}>
                            {value[1].split("/")[2].split(" ")[2]}
                        </Text>
                    </View>
                )}
            </View>



            {/* class type and group */}
            <View style={styles.cardElementsContainer}>
                <View style={[styles.cardElements, { backgroundColor: isTimeEqual(value[0]) ? colors.btn1 : "" }]}>
                    <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} />
                    <Text numberOfLines={2} style={[isTimeEqual(value[0]) ? styles.text2 : styles.text1,]}>
                        {value[1]?.split("/")[0]}
                    </Text>
                </View>
                <View style={[styles.cardElements, { backgroundColor: isTimeEqual(value[0]) ? colors.btn1 : "" }]}>
                    <Image source={require("../../../assets/icons/group.png")} style={{ height: 20, width: 20 }} transition={1000} />
                    <Text numberOfLines={2} style={[isTimeEqual(value[0]) ? styles.text2 : styles.text1,]}>
                        {value[1]?.split("/")[1].split(" ")[1]}
                    </Text>
                </View>
            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height: "95%",
        width: itemWidth + 20,
        backgroundColor: 'white',
        justifyContent: "space-between",
        marginRight: gap,
        borderRadius: 25,
        padding: 15,
        gap: 10,
    },
    cardElementsContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    cardElements: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 6,
        borderRadius: 10,
    },
    text1: {
        color: '#6d6c6c',
        fontSize: 13,
        fontWeight: '400'
    },
    text2: {
        color: 'white',
        fontSize: 13,
        fontWeight: '400'
    }
})