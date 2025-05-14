import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyles, HEIGHT } from "../../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

export default function AttendanceDetailsCard({ details }) {
    const isBlocked = details.block_reason !== "OK";

    return (
        <>
            <LinearGradient
                colors={isBlocked ? ['#d31027', '#ea384d'] : ['transparent', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.container, isBlocked && styles.blockedContainer]}>
                <LinearGradient
                    colors={
                        isBlocked
                            ? ['transparent', 'transparent']
                            : details.attendance === 'P'
                                ? [colors.green, colors.green]
                                : ['#d31027', '#ea384d']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.recordContainer]}>
                    <Text style={styles.text1}>
                        {isBlocked ? "B" : details.attendance}
                    </Text>
                </LinearGradient>

                <View style={[
                    styles.detailsContainer,
                    isBlocked && styles.blockedContainer
                ]}>
                    <View style={styles.detailsSubContainer}>
                        <View style={styles.detailWrapper}>
                            <Image
                                source={require("../../../assets/icons/timetable.png")}
                                style={{ height: 15, width: 15}}
                                transition={1000}
                            />
                            <Text style={[
                                styles.text2,
                                isBlocked && styles.blockedText
                            ]}>
                                {details.date}
                            </Text>
                        </View>

                        <View style={styles.detailWrapper}>
                            <Image
                                source={require("../../../assets/icons/clock.png")}
                                style={{ height: 15, width: 15 }}
                                transition={1000}
                            />
                            <Text style={[
                                styles.text2,
                                isBlocked && styles.blockedText
                            ]}>
                                {details.timing}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailsSubContainer}>
                        <View style={[styles.detailWrapper, { maxWidth: "70%" }]}>
                            <Image
                                source={require("../../../assets/icons/teacher.png")}
                                style={{ height: 15, width: 15 }}
                                transition={1000}
                            />
                            <Text numberOfLines={1} style={[
                                styles.text2,
                                isBlocked && styles.blockedText
                            ]}>
                                {details.faculty_name}
                            </Text>
                        </View>
                        <View style={styles.detailWrapper}>
                            <Text style={[
                                styles.text2,
                                isBlocked && styles.blockedText
                            ]}>
                                {isBlocked
                                    ? "Blocked"
                                    : details.type === "L"
                                        ? "Lecture"
                                        : details.type === "P"
                                            ? "Practical"
                                            : details.type === "T"
                                                ? "Tutorial"
                                                : <Text style={[styles.text2, { fontWeight: "bold" }]}>Type: {details.type}</Text>
                                }
                            </Text>
                        </View>
                    </View>
                    {isBlocked && <View style={styles.detailsSubContainer}>
                        <View style={styles.detailWrapper}>
                            <Text style={[
                                styles.text2,
                                isBlocked && styles.blockedText
                            ]}>
                                {details.block_reason}
                            </Text>
                        </View>
                    </View>}
                    
                </View>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: HEIGHT(15),
        width: '95%',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    recordContainer: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    detailsContainer: {
        justifyContent: "space-between",
        height: '70%',
        width: '75%',
    },
    blockedContainer: {
        height: '90%',
    },
    detailsSubContainer: {
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    detailWrapper: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    blockedText: {
        color: 'white',
    },
    text1: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 13,
        color: colors.lightDark,
        fontWeight: '500',
        flexShrink: 1,
        flexWrap: 'wrap',
    }
})