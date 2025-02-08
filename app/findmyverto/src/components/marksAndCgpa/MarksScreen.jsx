import Toast from "react-native-toast-message";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import SyncData from "../miscellaneous/SyncData";
import { colors } from "../../constants/colors";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { globalStyles, HEIGHT } from "../../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function MarksScreen({
    marks,
    marksLoading,
    markRefresh,
    isError,
    lastSynced,
    handleMarksFetch,
    navigation
}) {
    // Function to map the key to relevant details
    const mapKeyDetails = (key) => {
        const year = key.charAt(0); // First character represents the year
        const session = `${key.substring(1, 3)}-${key.substring(3, 5)}`; // Characters 2 to 4 represent the session
        let semester;

        const lastChar = key.charAt(5);
        if (isNaN(lastChar)) {
            // If the last character is a letter, handle it as backlog/reappear
            semester = "B/R/I";
            // semester = "Backlog/Reappear/Improvement";
        } else {
            semester = `Semester ${lastChar}`; // Regular semester
        }

        return { year, session, semester, isBacklog: isNaN(lastChar) };
    };

    const getGradientColorsForYear = (year) => {
        switch (year) {
            case "1":
                return ["#56CCF2", "#2F80ED"]; // Blue gradient for 1st year
            case "2":
                return ["#6FCF97", "#27AE60"]; // Green gradient for 2nd year
            case "3":
                return ["#F2994A", "#F2C94C"]; // Orange-yellow gradient for 3rd year
            case "4":
                return ["#BB6BD9", "#9B51E0"]; // Purple gradient for 4th year
            default:
                return ["#CCCCCC", "#AAAAAA"]; // Default gray gradient
        }
    };

    const normalSemesters = [];
    const backlogSemesters = [];

    Object.keys(marks)?.forEach((key, index) => {
        const { year, session, semester, isBacklog } = mapKeyDetails(key);

        const cardContent = (
            <View style={[styles.detailsContainer]}>
                <View style={styles.detailsSubContainer}>
                    <View style={styles.detailWrapper}>
                        <Image
                            source={require("../../../assets/icons/timetable.png")}
                            style={{ height: 15, width: 15 }}
                            transition={1000}
                        />
                        <Text style={styles.text2}>{semester}</Text>
                    </View>
                    <View style={[styles.detailWrapper, { maxWidth: "70%" }]}>
                        <Image
                            source={require("../../../assets/icons/teacher.png")}
                            style={{ height: 15, width: 15 }}
                            transition={1000}
                        />
                        <Text numberOfLines={1} style={styles.text2}>
                            Total subjects: {Object.keys(marks[key]).length}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsSubContainer}>
                    <View style={styles.detailWrapper}>
                        <Image
                            source={require("../../../assets/icons/clock.png")}
                            style={{ height: 15, width: 15 }}
                            transition={1000}
                        />
                        <Text style={styles.text2}>Session: {session}</Text>
                    </View>
                    <View style={[styles.detailWrapper]}>
                        <Text style={styles.text2}>Id: {key}</Text>
                    </View>
                </View>
            </View>
        );

        const card = (
            <Pressable key={index} style={styles.card} onPress={() => navigation.navigate("MarksDetails", {
                subjects: marks[key],
                year: isBacklog ? "backlog/reappear/improvement" : year,
                sem: isBacklog ? "" : semester,
                colors: getGradientColorsForYear(year),
            })}>
                {isBacklog ?
                    (
                        <LinearGradient colors={['#d31027', '#ea384d']}
                            start={{ x: 0, y: 0 }} // Start from the left
                            end={{ x: 1, y: 0 }}
                            style={[styles.yearCard, { paddingHorizontal: 20 }]}>
                            <Text style={[styles.text1]}>BRI</Text>
                            {/* <Text style={styles.text1}>{index+1}</Text> */}
                        </LinearGradient>
                    )
                    :
                    (
                        <LinearGradient colors={getGradientColorsForYear(year)}
                            start={{ x: 0, y: 0 }} // Start from the left
                            end={{ x: 1, y: 0 }}
                            style={styles.yearCard}>
                            <Text style={styles.text1}>
                                {year}
                                {year === "1" ? "st" : year === "2" ? "nd" : year === "3" ? "rd" : "th"}
                            </Text>
                            <Text style={styles.text1}>Year</Text>
                        </LinearGradient>
                    )}
                {cardContent}
            </Pressable>
        );

        if (isBacklog) {
            backlogSemesters.push(card);
        } else {
            normalSemesters.push(card);
        }
    });


    return (
        <View>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData self={!marksLoading} syncNow={() => handleMarksFetch(true)} time={marksLoading ? "Loading..." : formatTimeAgo(lastSynced)} color={"grey"} bg={"white"} loader={true} loading={markRefresh} />
            </View>
            {marksLoading &&
                <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <ShimmerPlaceHolder key={index} style={styles.shimmer} visible={false} />
                    ))

                    }
                </ScrollView>
            }

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={handleMarksFetch} timetableLoading={marksLoading} buttonHeight={45} ErrorMessage={"Marks"} />
                    :
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.body} contentContainerStyle={styles.scrollView}>
                        <Text style={styles.sectionHeader}>Normal Semesters</Text>
                        {normalSemesters}

                        {backlogSemesters.length > 0 && (
                            <>
                                <Text style={styles.sectionHeader}>Backlogs/Reappears/Improvements</Text>
                                {backlogSemesters}
                            </>
                        )}
                    </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        height: "97%",
        width: '100%',
        gap: HEIGHT(5),
        backgroundColor: "white"
    },
    shimmer: {
        width: '100%',
        height: HEIGHT(10),
        borderRadius: 25,
        ...globalStyles.elevationMin
    },
    scrollView: {
        // alignItems: 'center',
        gap: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    card: {
        height: HEIGHT(10),
        width: '100%',
        borderRadius: 25,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        ...globalStyles.elevationMin
        // paddingEnd: 20,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 5,
        color: "grey"
    },
    yearCard: {
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20
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
        fontSize: 15,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 13,
        color: colors.lightDark,
        fontWeight: '500',
        flexShrink: 1,  // Prevents text from overflowing
        flexWrap: 'wrap',  // Allows text to wrap to the next line
    }
});