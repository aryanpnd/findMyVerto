import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FontAwesome5, Octicons } from '@expo/vector-icons'
import AttendanceProgressBar from '../miscellaneous/AttendanceProgressBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { AuthContext } from '../../../context/Auth'
import Toast from 'react-native-toast-message'
import LottieView from 'lottie-react-native';
import { AppContext } from '../../../context/MainApp'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../../constants/colors'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { fetchBasicDetails } from '../../../utils/fetchUtils/userData/basicDetailsFetch'
import { useFocusEffect } from '@react-navigation/native'
import { HEIGHT, WIDTH } from '../../constants/styles'
import { fetchAttendance, fetchAttendanceSummary } from '../../../utils/fetchUtils/userData/attendanceFetch'
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter'
import { AttendanceSyncTime } from '../../../utils/settings/SyncAndRetryLimits'
import ButtonV1 from '../miscellaneous/buttons/ButtonV1'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function Header({ navigation }) {
    const { auth } = useContext(AuthContext);
    const { setAttendanceLoading, friendRequests } = useContext(AppContext);

    // Basic Details states
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [retryAttempts, setRetryAttempts] = useState(0);
    const [isRetryMaxValueReached, setIsRetryMaxValueReached] = useState(false);

    // Attendance states
    const [attendance, setAttendance] = useState(0);
    const [attendanceDetails, setAttendanceDetails] = useState({});
    const [isAttendanceError, setIsAttendanceError] = useState(false);
    const [attendanceLastSynced, setAttendanceLastSynced] = useState("");
    const [attendanceSummaryLoading, setAttendanceSummaryLoading] = useState(false);
    const [attendanceSummarySuccess, setAttendanceSummarySuccess] = useState(false);
    const [attendanceRefresh, setAttendanceRefresh] = useState(false);
    const [attendanceRetryAttempts, setAttendanceRetryAttempts] = useState(0);
    const [isAttendanceRetryMaxValueReached, setIsAttendanceRetryMaxValueReached] = useState(false);

    const retryAttemptsValue = 5;

    const handleDataFetch = async (sync, isRetry) => {
        await fetchBasicDetails(setLoading, setRefreshing, setUserDetails, auth, setIsError, sync, setLastSynced, isRetry);
    };

    const getAttendance = async (sync, isRetry) => {
        const syncInterval = AttendanceSyncTime();
        if (!sync && attendanceLastSynced) {
            // If auto-sync is off (syncInterval === 0) or the last sync was performed too recently, skip fetching.
            if (syncInterval === 0 || new Date().getTime() - new Date(attendanceLastSynced).getTime() <= syncInterval) {
                return;
            }
        }
        fetchAttendance(
            setAttendanceLoading,
            setAttendanceRefresh,
            setAttendance,
            setAttendanceDetails,
            auth,
            () => {},
            sync,
            setAttendanceLastSynced,
            isRetry
        );

        // This is to stop fetching attendance summary if the attendance fetch was successful
        // to avoid the condition where attendance is not fetched or have error but attendance summary
        // is fetched. For example, when you navigate to home screen it tries fetching attendance
        // and attendance summary as the sync condition is true, but you dont want to fetch 
        // attendance summary.
        if (attendanceSummarySuccess) {
            return
        }
        await fetchAttendanceSummary(
            setAttendanceSummaryLoading,
            setAttendanceRefresh,
            setAttendance,
            auth,
            setIsAttendanceError,
            sync,
            setAttendanceLastSynced,
            isRetry,
            setAttendanceSummarySuccess
        );
    };

    // Retry handler for basic details fetch
    const handleRetry = async () => {
        if (isError && retryAttempts < retryAttemptsValue) {
            console.log("Retrying basic details fetch:", retryAttempts, isError);
            setRetryAttempts(prev => prev + 1);
            await handleDataFetch(false, true);
        } else if (retryAttempts >= retryAttemptsValue) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Failed to fetch details',
                text2: 'Please check your internet connection',
            });
            setIsRetryMaxValueReached(true);
        }
    };

    // Retry handler for attendance fetch
    const handleAttendanceRetry = async () => {
        if (isAttendanceError && attendanceRetryAttempts < retryAttemptsValue) {
            console.log("Retrying attendance fetch:", attendanceRetryAttempts, isAttendanceError);
            setAttendanceRetryAttempts(prev => prev + 1);
            await getAttendance(false, true);
        } else if (attendanceRetryAttempts >= retryAttemptsValue) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Failed to fetch attendance',
                text2: 'Please check your internet connection',
            });
            setIsAttendanceRetryMaxValueReached(true);
        }
    };

    useFocusEffect(
        useCallback(() => {
            handleDataFetch(false);
            getAttendance(false, true);
        }, [])
    );

    useEffect(() => {
        if (isError && !loading) {
            handleRetry();
        }
    }, [isError, loading]);

    useEffect(() => {
        if (isAttendanceError && !attendanceSummaryLoading) {
            handleAttendanceRetry();
        }
    }, [isAttendanceError, attendanceSummaryLoading]);

    return (
        <LinearGradient style={styles.container} colors={[colors.secondary, colors.primary]}>
            <View style={styles.header}>
                <View style={{ height: '20%', alignItems: 'center' }}></View>

                <View style={styles.headerContainer}>
                    <View style={styles.searchbarContainer}>
                        <ButtonV1
                            childrenStyle={{
                                flexDirection: "row",
                                justifyContent: 'center',
                                gap: 10,
                                alignItems: 'center'
                            }}
                            scaleInValue={0.9}
                            style={styles.button1} onPress={() => navigation.navigate('VertoSearch')}>
                            <Text style={styles.text1}>Search Vertos</Text>
                            <Octicons name='search' color={colors.whiteLight} size={18} />
                        </ButtonV1>
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('FriendRequests')}
                                style={styles.button2}>
                                <Octicons name='person-add' size={15} color={colors.whiteLight} />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Requests</Text>
                            {friendRequests > 0 &&
                                <View style={styles.friendRequestsBadge}>
                                    <Text style={styles.friendRequestsBadgeText}>
                                        {friendRequests > 9 ? "9+" : friendRequests}
                                    </Text>
                                </View>
                            }
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => navigation.navigate('Settings')}>
                                {/* <FontAwesome5 name='settings' size={15} color={colors.whiteLight} /> */}
                                <Octicons name="gear" size={15} color={colors.whiteLight} />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Settings</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.bodyContainer}>
                    <TouchableOpacity style={styles.greeting} onPress={loading ? () => { } : () => navigation.navigate('MyProfile')}>
                        {!isRetryMaxValueReached && <Text style={{ fontSize: 20, color: colors.whiteLight, fontWeight: 'bold' }}>Hello,</Text>}
                        {loading ?
                            <ShimmerPlaceHolder visible={false} style={[styles.textMedium, styles.nameShimmerStyles]} /> :
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textMedium}>
                                {loading ? "" : userDetails?.data?.studentName}
                            </Text>}
                        <View style={{ flexDirection: "row" }}>
                            {loading ?
                                <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails?.data?.reg_no}
                                </Text>}
                            {loading ?
                                <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails?.data?.section}
                                </Text>}
                            {loading ?
                                <ShimmerPlaceHolder visible={false} style={[styles.textSmall, styles.shimmerStyles]} /> :
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSmall}>
                                    {loading ? "" : userDetails?.data?.rollNumber?.split(userDetails?.data?.section)[1]}
                                </Text>}
                        </View>
                        {!loading && <Text style={styles.textInfo}>
                            Click to view profile
                        </Text>}
                    </TouchableOpacity>

                    <ButtonV1
                        childrenStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        scaleInValue={0.9}
                        style={styles.AttendanceContainer} onPress={loading ? () => { } : () => navigation.navigate('Attendance')}>
                        <Text style={{ fontWeight: '500', color: colors.whiteLight, marginTop: 5 }}>Attendance</Text>
                        {
                            attendanceSummaryLoading ?
                                <Text style={{ fontSize: 10, color: colors.whiteLight, marginBottom: 5 }}>Loading...</Text>
                                :
                                <Text style={{ fontSize: 10, color: colors.whiteLight, marginBottom: 5 }}>
                                    {formatTimeAgo(attendanceLastSynced)}
                                </Text>
                        }
                        {isAttendanceError ? (
                            <>
                                <Text style={{ color: colors.whiteLight, fontWeight: "bold" }}>Error</Text>
                                <Text style={{ color: colors.whiteLight, fontSize: 10 }}>Click to open</Text>
                            </>
                        ) : attendanceSummaryLoading ? (
                            <LottieView
                                autoPlay
                                style={{
                                    width: 50,
                                    height: 50,
                                }}
                                source={require('../../../assets/lotties/loading1.json')}
                            />
                        ) : (
                            <AttendanceProgressBar size={50} attendance={parseInt(attendance?.total_details?.agg_attendance) || 0} />
                        )}
                    </ButtonV1>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40%',
        width: '90%',
    },
    headerContainer: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: '55%',
        backgroundColor: colors.blueTransparency,
        alignItems: 'center',
        marginBottom: 13,
        padding: 10,
        borderRadius: 15,
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%'
    },
    searchbarContainer: {
        width: '50%',
        height: '60%',
    },
    greeting: {
        width: '65%',
        overflow: 'hidden',
        paddingLeft: 5,
        justifyContent: 'center',
    },
    AttendanceContainer: {
        width: '30%',
        height: HEIGHT(13),
        backgroundColor: colors.btn1,
        borderRadius: 25,
        alignItems: 'center',
    },
    button1: {
        backgroundColor: colors.btn1,
        flex: 1,
        borderRadius: 15,
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    button2: {
        backgroundColor: colors.btn1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: '60%',
        minWidth: WIDTH(11),
    },
    iconContainer: {
        width: '35%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    friendRequestsBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: colors.red,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendRequestsBadgeText: {
        color: "white",
        fontSize: 9,
        fontWeight: 'bold',
    },
    text1: {
        color: colors.whiteLight
    },
    textInfo: {
        fontSize: 11,
        color: colors.whiteLight,
        textAlign: 'center',
        marginTop: 5
    },
    textSmall: {
        marginRight: 15,
        fontSize: 15,
        fontWeight: '400',
        color: 'white'
    },
    textMedium: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    nameShimmerStyles: {
        borderRadius: 5,
        height: "30%",
        margin: 2,
        marginBottom: 10
    },
    shimmerStyles: {
        borderRadius: 5,
        height: 20,
        margin: 2,
        width: "24%"
    }
})
