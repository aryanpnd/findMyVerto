import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import SyncData from "../miscellaneous/SyncData";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles";
import { colors } from "../../constants/colors";
import Toast from "react-native-toast-message";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import { useEffect } from "react";
import LottieView from "lottie-react-native";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function ExamsScreen({
    exams,
    examsLoading,
    examsRefresh,
    isError,
    lastSynced,
    handleExamsFetch,
    navigation
}) {
    return (
        <View style={{ backgroundColor: colors.whitePrimary, flex: 1 }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={examsLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleExamsFetch(true)}
                    dataLoading={examsLoading}
                    self={!examsLoading}
                    color={"white"} bg={colors.secondary}
                    loader={true} loading={examsRefresh} />
            </View>

            {!isError && exams?.length > 0 && <View style={styles.header}>
                {
                    examsLoading ?
                        <ShimmerPlaceHolder style={{
                            height: HEIGHT(3),
                            width: WIDTH(90),
                            borderRadius: 10
                        }} visible={false} />
                        :
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <Text style={[styles.text1, { color: colors.whitePrimary }]}>From: {exams[0].date}</Text>
                            <Text style={[styles.text1, { color: colors.whitePrimary }]}>Till: {exams[exams.length - 1].date}</Text>
                        </View>
                }
            </View>}

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={handleExamsFetch} timetableLoading={examsLoading} buttonHeight={45} ErrorMessage={"exams"} />
                    :
                    examsLoading ?
                        <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <ShimmerPlaceHolder key={index} style={[{
                                    height: HEIGHT(20),
                                    width: WIDTH(95),
                                    borderRadius: 20,
                                    marginVertical: HEIGHT(1),
                                }]} visible={false} />
                            ))}
                        </ScrollView>
                        :
                        exams?.length > 0 ?
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.body} contentContainerStyle={styles.scrollView}>
                                {
                                    exams.map((exam, index) => (
                                        exam.gap ?
                                            exam.beginGap ?

                                                <LinearGradient
                                                    key={index}
                                                    colors={['#a8e063', '#56ab2f']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[
                                                        styles.gapCard,
                                                        { justifyContent: "center" }
                                                        //  globalStyles.elevationMin
                                                    ]}>
                                                    <View style={{ width: "40%", justifyContent: "center" }}>
                                                        <Text style={[styles.text2, { textAlign: "center", fontSize: 20, fontWeight: "bold", color: "white" }]}>
                                                            {exam.gap} {exam.gap > 1 ? "days" : "day"}
                                                            {" "}to go
                                                        </Text>
                                                    </View>
                                                </LinearGradient>
                                                :
                                                <LinearGradient
                                                    key={index}
                                                    colors={['#a8e063', '#56ab2f']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[
                                                        styles.gapCard,
                                                        //  globalStyles.elevationMin
                                                    ]}>
                                                    <View style={{ width: "40%", justifyContent: "center" }}>
                                                        <Text style={[styles.text2, { textAlign: "center", fontSize: 20, fontWeight: "bold", color: "white" }]}>Gap: {exam.gap} {exam.gap > 1 ? "days" : "day"}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: "space-between", height: "80%", paddingLeft: WIDTH(5), paddingRight: WIDTH(2), alignItems: "center" }}>
                                                        <Text style={[styles.text2, { color: colors.whitePrimary, fontWeight: "bold" }]}>From: {exam.from}</Text>
                                                        <Text style={[styles.text2, { color: colors.whitePrimary, fontWeight: "bold" }]}>To: {exam.to}</Text>
                                                    </View>
                                                </LinearGradient>
                                            :
                                            <LinearGradient
                                                colors={["white", "white"]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }} key={index} style={styles.card}>

                                                <View style={{ padding: 5, borderBottomWidth: 1, borderColor: "grey", marginBottom: HEIGHT(1) }}>
                                                    <Text style={[styles.text2, { fontWeight: "400", textAlign: "center" }]}>{exam.exam_type}</Text>
                                                </View>

                                                <View>
                                                    <Text style={[{ fontWeight: "bold", fontSize: 15 }]}>[{exam.course_code}] - {exam.course_name}</Text>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View style={styles.infoContainer}>
                                                        <Image
                                                            source={require("../../../assets/icons/schedule.png")}
                                                            style={{ height: 20, width: 20 }}
                                                            transition={1000}
                                                        />
                                                        <Text style={styles.text2}>{exam.date}</Text>
                                                    </View>
                                                    <View style={styles.infoContainer}>
                                                        <Image
                                                            source={require("../../../assets/icons/clock.png")}
                                                            style={{ height: 20, width: 20 }}
                                                            transition={1000}
                                                        />
                                                        <Text style={styles.text2}>{exam.time}</Text>
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View style={styles.infoContainer}>
                                                        <Image
                                                            source={require("../../../assets/icons/building.png")}
                                                            style={{ height: 20, width: 20 }}
                                                            transition={1000}
                                                        />
                                                        <Text style={styles.text2}>{exam.room_no}</Text>
                                                    </View>
                                                </View>

                                                <View style={[styles.infoContainer, { justifyContent: "center" }]}>
                                                    <Text style={[styles.text2, { maxWidth: "100%" }]}>Reporting Time: {exam.reporting_time}</Text>
                                                </View>

                                                {exam.defaulter_detail && <View style={[styles.infoContainer, { justifyContent: "center" }]}>
                                                    <Text style={[styles.text2, { maxWidth: "100%" }]}>defaulter detail: {exam.defaulter_detail}</Text>
                                                </View>}

                                                {exam.detainee_status && <View style={[styles.infoContainer, { justifyContent: "center" }]}>
                                                    <Text style={[styles.text2, { maxWidth: "100%" }]}>detainee status: {exam.detainee_status}</Text>
                                                </View>}

                                            </LinearGradient>
                                    ))
                                }
                            </ScrollView>
                            :
                            <ScrollView showsVerticalScrollIndicator={false} style={[styles.body]} contentContainerStyle={styles.scrollView}>
                                <LottieView
                                    source={require("../../../assets/lotties/empty.json")}
                                    autoPlay
                                    loop
                                    style={{ height: HEIGHT(50), width: WIDTH(80), alignSelf: "center" }}
                                />
                                <Text style={[styles.text1, { color: "grey" }]}>No exams found</Text>

                            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: WIDTH(5),
        paddingVertical: HEIGHT(2),
        backgroundColor: colors.secondary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    body: {
        height: HEIGHT(84),
        // backgroundColor:"red",
        paddingVertical: HEIGHT(2),
        paddingHorizontal: WIDTH(2),
    },
    scrollView: {
        // paddingVertical: HEIGHT(2),
        paddingBottom: HEIGHT(5),
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        // height: HEIGHT(15),
        width: WIDTH(95),
        backgroundColor: "white",
        borderRadius: 20,
        marginVertical: HEIGHT(1),
        paddingHorizontal: WIDTH(4),
        paddingVertical: HEIGHT(2),
        gap: 10,
        ...globalStyles.elevationMin
    },
    gapCard: {
        height: HEIGHT(10),
        width: WIDTH(95),
        borderRadius: 20,
        paddingHorizontal: WIDTH(3),
        paddingVertical: HEIGHT(1),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: HEIGHT(1),
        gap: 5,
    },
    text1: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.whitePrimary,
    },
    text2: {
        // fontSize: 14,
        fontWeight: "500",
        color: "gray",
    }
});