import { View, Text, StyleSheet, Dimensions, Image, Pressable, ScrollView } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { AppContext } from '../../../context/MainApp';
import isTimeEqual from '../../utils/helperFunctions/funtions';
import { colors } from '../../constants/colors';
import { globalStyles, HEIGHT } from '../../constants/styles';
import BreakCard from './BreakCard';
import LottieView from 'lottie-react-native';


const { width,height } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function ClassesTodayCards({ value, index, navigation }) {
    const { courses } = useContext(AppContext)
    const [isTimeEqualState, setIsTimeEqualState] = useState(false)
    useEffect(() => {
        setIsTimeEqualState(isTimeEqual(value.time))
    }, [value.time])
    return (
        // <Pressable onPress={() => navigation.navigate("Timetable")}>
            <LinearGradient
                colors={isTimeEqualState ? ['#11998e', '#32cf6d'] : ["white", "transparent"]}
                style={[styles.cardContainer, globalStyles.elevationMin]}
                start={{ x: 0, y: 0 }} // Start from the left
                end={{ x: 1, y: 0 }}
            >

                <View style={[styles.timeContainer, { backgroundColor: isTimeEqualState ? colors.orange : colors.btn1 }]}>
                    <Image
                        source={require("../../../assets/icons/clock.png")}
                        style={{ height: 20, width: 20 }}
                        transition={1000}
                    />
                    <Text numberOfLines={2} style={[isTimeEqualState ? styles.text2 : styles.text1, { fontWeight: "500" }]}>
                        {isTimeEqualState ? `Ongoing (${value.time})` : value.time}
                    </Text>
                </View>

                {
                    value.break ?
                        <LinearGradient
                            colors={['#a8e063', '#56ab2f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} style={[styles.breakCard, globalStyles.elevationMin]}>
                            <Text style={styles.breakCardText}>Break</Text>
                        </LinearGradient>
                        :

                        <View>
                            {  
                                value?.class?.map((classDetail, index) => (
                                    <React.Fragment key={index}>
                                        <View style={styles.classContainer}>
                                            {/* Course name */}
                                            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                                                <Text numberOfLines={2} style={[isTimeEqual(value["time"]) ? styles.text2 : styles.text1, { fontWeight: 'bold', fontSize: 14 }]}>
                                                    {`[${classDetail.class}] ${classDetail.className}`}
                                                </Text>
                                            </View>

                                            {/* class type and building */}
                                            <View style={styles.cardElementsContainer}>
                                                <View style={[styles.cardElements, { backgroundColor: isTimeEqualState ? colors.blueTransparency : "" }]}>
                                                    {/* <Image
                                                    source={require("../../../assets/icons/section.png")}
                                                    style={{ height: 20, width: 20 }}
                                                    transition={1000}
                                                /> */}
                                                    <Text numberOfLines={2} style={[isTimeEqualState ? styles.text2 : styles.text1, { fontWeight: "500" }]}>
                                                        <Text style={{ fontWeight: "bold", color: isTimeEqualState ? "white" : "black" }}>Section:</Text> {classDetail.section}
                                                    </Text>
                                                </View>
                                                <View style={[styles.cardElements, { backgroundColor: isTimeEqualState ? colors.blueTransparency : "", },]}>
                                                    <Image
                                                        source={require("../../../assets/icons/building.png")}
                                                        style={{ height: 20, width: 20 }}
                                                        transition={1000}
                                                    />
                                                    <Text numberOfLines={2} style={[isTimeEqualState ? styles.text2 : styles.text1,]}>
                                                        {classDetail.room}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* class type and group */}
                                            <View style={styles.cardElementsContainer}>
                                                <View style={[styles.cardElements, { backgroundColor: isTimeEqualState ? colors.btn1 : "" }]}>
                                                    <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} />
                                                    <Text numberOfLines={2} style={[isTimeEqualState ? styles.text2 : styles.text1,]}>
                                                        {classDetail.type}
                                                    </Text>
                                                </View>
                                                <View style={[styles.cardElements, { backgroundColor: isTimeEqualState ? colors.btn1 : "" }]}>
                                                    {/* <Image source={require("../../../assets/icons/group.png")} style={{ height: 20, width: 20 }} transition={1000} /> */}
                                                    <Text numberOfLines={2} style={[isTimeEqualState ? styles.text2 : styles.text1,]}>
                                                        <Text style={{ fontWeight: "bold", color: isTimeEqualState ? "white" : "black" }}>Group:</Text> {classDetail.group}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        {value.class.length > 1 && index !== value.class.length - 1 && <View style={styles.divider}></View>}

                                    </React.Fragment>
                                ))
                            }
                        </View>
                }
            </LinearGradient>
        // </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        // height: HEIGHT(25),
        backgroundColor: 'white',
        maxHeight: HEIGHT(25),
        // justifyContent: "space-between",
        marginRight: gap,
        borderRadius: 25,
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
    timeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 20,
        gap: 5,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    classWrapper: {
        flexDirection: "row"
    },
    classContainer: {
        justifyContent: "space-between",
        // height: "90%",
        width: itemWidth,
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 10
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
    },
    breakCard: {
        height: HEIGHT(15),
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    breakCardText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    divider: {
        height: "80%",
        width: 1,
        backgroundColor: colors.disabledBackground,
        marginHorizontal: 5,
        alignSelf: "center"
    }
})