import { ScrollView, View, Animated, StyleSheet, Text, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import SyncData from "../miscellaneous/SyncData";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import PagerButtons from "../miscellaneous/PagerButtons";
import { HEIGHT, WIDTH } from "../../constants/styles";
import AssignmentCard from "./AssignmentCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants/colors";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import LottieView from "lottie-react-native";
import { userStorage } from "../../../utils/storage/storage";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function AssignmentsScreen({
    assignments,
    AssignmentsLoading,
    AssignmentsRefresh,
    isError,
    lastSynced,
    handleAssignmentsFetch,
    navigation
}) {
    const [theory, setTheory] = useState([]);
    const [practical, setPractical] = useState([]);
    const [reading, setReading] = useState([]);
    const [courses, setCourses] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isTheoryFocused, setTheoryFocused] = useState(false);
    const [isPracticalFocused, setPracticalFocused] = useState(false);
    const [isReadingFocused, setReadingFocused] = useState(false);

    const scrollViewRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const buttons = [
        'Theory' + (theory?.length ? " " + theory?.length : " 0"),
        'Practical' + (practical?.length ? " " + practical?.length : " 0"),
        'Reading' + (reading?.length ? " " + reading?.length : " 0"),
    ];
    const onCLick = i => scrollViewRef.current?.scrollTo({ x: i * WIDTH(100) });

    useEffect(() => {
        if (assignments) {
            if (searchQuery.trim() === "") {
                setTheory(assignments.theory);
                setPractical(assignments.practical);
                setReading(assignments.reading);
            } else {
                const lowerText = searchQuery.toLowerCase();
                setTheory(assignments.theory.filter(item => {
                    const courseCode = item.course_code.toLowerCase();
                    const courseTitle = courses[item.course_code]?.course_title?.toLowerCase() || "";
                    return courseCode.includes(lowerText) || courseTitle.includes(lowerText);
                }));
                setPractical(assignments.practical.filter(item => {
                    const courseCode = item.course_code.toLowerCase();
                    const courseTitle = courses[item.course_code]?.course_title?.toLowerCase() || "";
                    return courseCode.includes(lowerText) || courseTitle.includes(lowerText);
                }));
                setReading(assignments.reading.filter(item => {
                    const courseCode = item.course_code.toLowerCase();
                    const courseTitle = courses[item.course_code]?.course_title?.toLowerCase() || "";
                    return courseCode.includes(lowerText) || courseTitle.includes(lowerText);
                }));
            }
        }
    }, [assignments, searchQuery, courses]);

    const getCourses = async () => {
        const coursesItem = userStorage.getString("TIMETABLE");
        if (coursesItem) {
            const coursesData = JSON.parse(coursesItem);
            setCourses(coursesData.data.courses);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    const filterSubjects = (text) => {
        setSearchQuery(text);
    };

    return (
        <View style={{ backgroundColor: "white", flex: 1, gap: 10 }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={AssignmentsLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleAssignmentsFetch(true)}
                    self={!AssignmentsLoading}
                    loader={true}
                    loading={AssignmentsRefresh}
                />
            </View>

            {
                isError ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ErrorMessage handleFetchTimetable={()=>handleAssignmentsFetch(true)} timetableLoading={AssignmentsLoading||AssignmentsRefresh} buttonHeight={45} ErrorMessage={"Assignments"} />
                    </View>
                    :
                    <View style={styles.body}>
                        <PagerButtons
                            buttons={buttons}
                            onClick={onCLick}
                            scrollX={scrollX}
                            containerHeight={HEIGHT(6)}
                            containerWidth={WIDTH(95)}
                            pageWidth={WIDTH(100)}
                        />

                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false },
                            )}>
                            {
                                AssignmentsLoading ?
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <ShimmerPlaceHolder key={index} style={[{
                                                height: HEIGHT(12),
                                                width: WIDTH(95),
                                                borderRadius: 20,
                                                marginVertical: HEIGHT(1),
                                            }]} visible={false} />
                                        ))}
                                    </View>
                                    :
                                    buttons.map((button, index) => {
                                        return (
                                            <ScrollView style={styles.scrollview} contentContainerStyle={styles.assignmentBody} key={index}>
                                                <View style={{ alignItems: 'center', gap: 20 }}>
                                                    <SearchBar
                                                        searchQuery={searchQuery}
                                                        updateSearchQuery={filterSubjects}
                                                        isFocused={index === 0 ? isTheoryFocused : index === 1 ? isPracticalFocused : isReadingFocused}
                                                        setFocused={index === 0 ? setTheoryFocused : index === 1 ? setPracticalFocused : setReadingFocused}
                                                    />
                                                    {index === 0 && theory?.map((assignment, index) => (
                                                        <AssignmentCard key={index} assignment={assignment} courses={courses} />
                                                    ))}
                                                    {index === 1 && practical?.map((assignment, index) => (
                                                        <AssignmentCard key={index} assignment={assignment} courses={courses} />
                                                    ))}
                                                    {index === 2 && reading?.map((assignment, index) => (
                                                        <AssignmentCard key={index} assignment={assignment} courses={courses} />
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        );
                                    })
                            }
                        </ScrollView>
                    </View>
            }
        </View>
    );
}

function SearchBar({ searchQuery, updateSearchQuery, isFocused, setFocused }) {
    return (
        <TextInput
            style={[styles.searchBar, {
                borderColor: isFocused ? colors.lightDark : colors.disabledBackground,
                backgroundColor: isFocused ? "white" : "transparent",
            }]}
            placeholder={isFocused ? "" : 'Search in subject or subject code '}
            placeholderTextColor={"grey"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={searchQuery}
            onChangeText={updateSearchQuery}
        />
    );
}

const NoAssignments = () => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", gap: 8, width: WIDTH(100), height: HEIGHT(80) }}>
            <LottieView
                autoPlay
                style={{
                    width: 100,
                    height: 100,
                }}
                source={require('../../../assets/lotties/sleep.json')}
            />
            <Text style={styles.text1}>No Assignments for now</Text>
            <Text style={styles.text1}>Have fun...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        height: HEIGHT(90),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 10
    },
    scrollview: {
        width: WIDTH(100),
        height: HEIGHT(80),
    },
    assignmentBody: {
        paddingTop: HEIGHT(2),
        paddingBottom: HEIGHT(5),
        alignItems: 'center',
        gap: 10
    },
    searchBar: {
        width: WIDTH(95),
        height: HEIGHT(6),
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15
    },
});
