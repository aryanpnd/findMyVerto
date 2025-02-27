import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import SyncData from "../miscellaneous/SyncData";
import Toast from "react-native-toast-message";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { colors } from "../../constants/colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useEffect, useState } from "react";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function CgpaScreen({
    cgpa,
    cgpaLoading,
    cgpaRefresh,
    isError,
    lastSynced,
    handleCgpaFetch,
    navigation
}) {
    const [aggregateCGPA, setAggregateCGPA] = useState(0);

    const getCpgaColor = (cgpa) => {
        if (cgpa >= 7.5) {
            return "#2ecc71";
        } else if (cgpa >= 6.0) {
            return "#686de0";
        } else {
            return "#ea2027";
        }
    };

    const calculateAggregateCGPA = (cgpaData) => {
        const totalCgpa = Object.keys(cgpaData).reduce((sum, key) => sum + parseFloat(cgpaData[key].tgpa), 0);
        return (totalCgpa / Object.keys(cgpaData).length).toFixed(2);
    };

    const getYearAndSemester = (term) => {
        switch (term) {
            case "I":
                return "1st Year 1st Semester";
            case "II":
                return "1st Year 2nd Semester";
            case "III":
                return "2nd Year 1st Semester";
            case "IV":
                return "2nd Year 2nd Semester";
            case "V":
                return "3rd Year 1st Semester";
            case "VI":
                return "3rd Year 2nd Semester";
            case "VII":
                return "4th Year 1st Semester";
            case "VIII":
                return "4th Year 2nd Semester";
            case "IX":
                return "5th Year 1st Semester";
            case "X":
                return "5th Year 2nd Semester";
            default:
                return "";
        }
    };

    useEffect(() => {
        if (cgpa) {
            setAggregateCGPA(calculateAggregateCGPA(cgpa));
        }
    }, [cgpa]);

    return (
        <View style={{ backgroundColor: "white" }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={cgpaLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleCgpaFetch(true)}
                    dataLoading={cgpaLoading}
                    self={!cgpaLoading}
                    color={"white"} bg={colors.secondary}
                    loader={true} loading={cgpaRefresh} />
            </View>

            {!isError && <View style={styles.aggregateHeader}>
                {
                    cgpaLoading ?
                        <ShimmerPlaceHolder style={{ height: HEIGHT(14), width: WIDTH(90), borderRadius: 20 }} visible={false} />
                        :
                        <LinearGradient
                            colors={[colors.secondary, colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.aggregateCard}>
                            <Text style={[styles.aggregateHeaderTitle, { color: "white" }]}>Aggregate (CGPA)</Text>
                            {/* <View style={styles.progressBarCard}> */}
                            <AnimatedCircularProgress
                                size={90}
                                width={8}
                                fill={aggregateCGPA * 10}
                                rotation={180}
                                tintColor={getCpgaColor(aggregateCGPA)}
                                backgroundColor="#ffffff87">
                                {() => (
                                    <Text style={{ color: "white", fontSize: 25, fontWeight: '500' }}>{aggregateCGPA}</Text>
                                )}
                            </AnimatedCircularProgress>
                            {/* </View> */}
                        </LinearGradient>
                }

                <Text style={{textAlign:"center",fontSize:12,color:"white",marginTop:10}}>Click on the cards to view the details</Text>
            </View>
            }

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={()=>handleCgpaFetch(true)} timetableLoading={cgpaLoading || cgpaRefresh} buttonHeight={45} ErrorMessage={"CGPA"} />
                    :
                    cgpaLoading ?
                        <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
                            {Array.from({ length: 9 }).map((_, index) => (
                                <ShimmerPlaceHolder key={index} style={[styles.card, { paddingHorizontal: 0 }]} visible={false} />
                            ))}
                        </ScrollView>
                        :
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.body} contentContainerStyle={styles.scrollView}>
                            {
                                Object.keys(cgpa).map((key, index) => (
                                    <Pressable
                                        onPress={() => navigation.navigate("CGPADetails", {
                                            grades: cgpa[key].course_grades,
                                            sem: cgpa[key].term,
                                            tgpa: cgpa[key].tgpa
                                        })}
                                        key={index}>
                                        <View style={styles.card}>
                                            <View>
                                                <Text style={{ fontSize: 20, fontWeight: "500", color: "black" }} >{key}</Text>
                                                <Text style={{ fontSize: 15, fontWeight: "500", color: "grey" }}>{getYearAndSemester(cgpa[key].term)}</Text>
                                                {/* <Text>{cgpa[key]}</Text> */}
                                            </View>
                                            {/* <View style={styles.progressBarCard}> */}
                                            <AnimatedCircularProgress
                                                size={90}
                                                width={5}
                                                fill={parseFloat(cgpa[key].tgpa) * 10}
                                                rotation={180}
                                                tintColor={getCpgaColor(parseFloat(cgpa[key].tgpa))}
                                                backgroundColor="#ffffff87">
                                                {() => (
                                                    <Text style={{ color: "grey", fontSize: 25, fontWeight: '500' }}>{parseFloat(cgpa[key].tgpa).toFixed(2)}</Text>
                                                )}
                                            </AnimatedCircularProgress>
                                        </View>
                                        {/* <Text>Click to view the details</Text> */}
                                    </Pressable>
                                ))
                            }
                        </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        height: HEIGHT(72),
        width: '100%',
        backgroundColor: "white"
    },
    scrollView: {
        padding: HEIGHT(1),
        paddingVertical: HEIGHT(2),
        gap: 10,
        alignItems: "center",
        // justifyContent: "space-between"
    },
    aggregateHeader: {
        backgroundColor: colors.secondary,
        padding: HEIGHT(2),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: "center",
    },
    aggregateCard: {
        height: HEIGHT(14),
        width: WIDTH(92),
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        ...globalStyles.elevation
    },
    aggregateHeaderTitle: {
        color: colors.secondary,
        fontSize: 18,
        fontWeight: '500'
    },

    card: {
        backgroundColor: "white",
        height: HEIGHT(14),
        width: WIDTH(95),
        paddingHorizontal: WIDTH(5),
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        ...globalStyles.elevationMin
    },
    progressBarCard: {
        height: "80%",
        width: "30%",
        padding: 5,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        ...globalStyles.elevationMin
    }
});