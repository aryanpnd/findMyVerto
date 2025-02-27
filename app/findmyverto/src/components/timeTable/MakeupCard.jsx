import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { globalStyles, WIDTH } from '../../constants/styles';
import { isDayEqual, isTimeEqual } from '../../../utils/helperFunctions/dataAndTimeHelpers';
import { useEffect, useState } from 'react';

export default function MakeupCard({ makeup, navigation }) {
    const [ongoing, setOngoing] = useState(false)

    const checkOngoing = () => {
        const isOngoing = isTimeEqual(makeup.lectureTime) && isDayEqual(makeup.scheduledDate).isEqual
        setOngoing(isOngoing)
    }
    useEffect(() => {
        checkOngoing()
    }, [makeup])
    return (
        <LinearGradient
            colors={["white", "white"]}
            style={[styles.container, globalStyles.elevationMin]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>

            {/* Class Time */}
            <LinearGradient colors={ongoing ? ['#a8e063', '#56ab2f'] : ["white", "white"]}
                style={[styles.timeContainer, ongoing && { borderWidth: 0 }]}
            >
                <Image
                    source={require("../../../assets/icons/clock.png")}
                    style={{ height: 20, width: 20 }}
                    transition={1000}
                />
                <Text style={[styles.text2]}>{makeup.lectureTime}</Text>
                <Text style={[styles.text2]}>{makeup.scheduledDate}</Text>
                <Text style={[styles.text2]}>{isDayEqual(makeup.scheduledDate).daysLeft} days to go</Text>
            </LinearGradient>

            <View style={styles.classesContainer}>

                {/* Course name and code  */}
                <View>
                    <Text style={styles.text1}>
                        {makeup.courseCode}
                    </Text>
                </View>

                <View style={styles.classInfoContainer}>
                    <View style={[styles.btnEffect]}>
                        <Image
                            source={require("../../../assets/icons/building.png")}
                            style={{ height: 20, width: 20 }}
                            transition={1000}
                        />
                        <Text style={styles.text2}>{makeup.roomNumber}</Text>
                    </View>

                    <View style={styles.btnEffect}>
                        {/* <Image
                            source={require("../../../assets/icons/section.png")}
                            style={{ height: 20, width: 20 }}
                            transition={1000}
                          /> */}
                        <Text style={styles.text2}>Section: {makeup.section}</Text>
                    </View>
                </View>

                <View style={styles.classInfoContainer}>

                    <View style={styles.btnEffect}>
                        {/* <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} /> */}
                        <Text style={styles.text2}>Group: {makeup.groupNumber}</Text>
                    </View>

                    <View style={styles.btnEffect}>
                        {/* <Image source={require("../../../assets/icons/course.png")} style={{ height: 20, width: 20 }} transition={1000} /> */}
                        <Text style={styles.text2}>Type: {makeup.attendanceType}</Text>
                    </View>
                </View>

                <View style={styles.classInfoContainer}>

                    <View style={styles.btnEffect}>
                        <Image source={require("../../../assets/icons/teacher.png")} style={{ height: 20, width: 20 }} transition={1000} />
                        <Text style={[styles.text2, { maxWidth: WIDTH(25) }]}>{makeup.takenBy}</Text>
                    </View>

                    <View style={styles.btnEffect}>
                        <Text style={styles.text2}>UID: {makeup.uid}</Text>
                    </View>
                </View>
            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: 100,
        // width: 360,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        // gap: 5
    },
    timeContainer: {
        borderWidth: 1,
        borderColor: '#c31432',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        gap: 10,
        width: WIDTH(25)
    },
    classesContainer: {
        width: WIDTH(60),
        // backgroundColor:'red',
        justifyContent: 'space-between',
        // padding: 2,
        gap: 10
    },
    classInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnEffect: {
        padding: 5,
        backgroundColor: colors.btn1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    text1: {
        color: "grey",
        fontSize: 14,
        fontWeight: 'bold'
    },
    text2: {
        // color: 'white',
        color: "grey",
    },
    divider: {
        width: "80%",
        height: 1,
        backgroundColor: colors.disabledBackground,
        marginVertical: 5,
        alignSelf: "center"
    }
})