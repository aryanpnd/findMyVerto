import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyles, HEIGHT } from "../../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

export default function AttendanceDetailsCard({ details }) {
    return (
        <>
            {
                details.block_reason === "OK" ?
                    <View style={styles.container}>
                        <LinearGradient colors={details.attendance === 'P' ? [colors.green, colors.green] : ['#d31027', '#ea384d']}
                            start={{ x: 0, y: 0 }} // Start from the left
                            end={{ x: 1, y: 0 }}
                            style={[styles.recordContainer]}>
                            <Text style={styles.text1}>{details.attendance}</Text>
                        </LinearGradient>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailsSubContainer}>
                                <View style={styles.detailWrapper}>
                                    <Image
                                        source={require("../../../assets/icons/timetable.png")}
                                        style={{ height: 15, width: 15 }}
                                        transition={1000}
                                    />
                                    <Text style={styles.text2}>{details.date}</Text>
                                </View>

                                <View style={styles.detailWrapper}>
                                    <Image
                                        source={require("../../../assets/icons/clock.png")}
                                        style={{ height: 15, width: 15 }}
                                        transition={1000}
                                    />
                                    <Text style={styles.text2}>{details.timing}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsSubContainer}>
                                <View style={[styles.detailWrapper, { maxWidth: "70%" }]}>
                                    <Image
                                        source={require("../../../assets/icons/teacher.png")}
                                        style={{ height: 15, width: 15 }}
                                        transition={1000}
                                    />
                                    <Text numberOfLines={1} style={styles.text2}>{details.faculty_name}</Text>
                                </View>
                                <View style={[styles.detailWrapper,
                                    // { alignSelf: "flex-end" }
                                ]}>
                                    <Text style={styles.text2}>{
                                        details.type === "L" ? "Lecture" :
                                            details.type === "P" ? "Practical" :
                                                details.type === "T" ? "Tutorial" :
                                                    <Text style={[styles.text2, { fontWeight: "bold" }]}>Type: {details.type}</Text>
                                    }</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    :
                    <LinearGradient colors={['#d31027', '#ea384d']}
                        start={{ x: 0, y: 0 }} // Start from the left
                        end={{ x: 1, y: 0 }}
                        style={[styles.container, { justifyContent: "center" }]}>
                        <Text style={styles.text1}>Blocked</Text>
                    </LinearGradient>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT(10),
        width: '95%',
        borderRadius: 25,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        // paddingEnd: 20,
    },
    recordContainer: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    detailsContainer: {
        // flexDirection: 'row',
        justifyContent: "space-between",
        height: '90%',
        width: '75%',
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
    text1: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 13,
        color: colors.lightDark,
        fontWeight: '500',
        flexShrink: 1,  // Prevents text from overflowing
        flexWrap: 'wrap',  // Allows text to wrap to the next line
    }

})