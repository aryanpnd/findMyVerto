import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FontAwesome5, Octicons } from '@expo/vector-icons'
import AttendanceProgressBar from '../miscellaneous/AttendanceProgressBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { API_URL, AuthContext } from '../../../context/Auth'
import Toast from 'react-native-toast-message'
import LottieView from 'lottie-react-native';
import { AppContext } from '../../../context/MainApp'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../../constants/colors'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'; // Import the shimmer placeholder
import { fetchBasicDetails } from '../../utils/fetchUtils/basicDetailsFetch'
import { useFocusEffect } from '@react-navigation/native'
import { is } from 'react-native-cheerio/lib/api/attributes'
import { WIDTH } from '../../constants/styles'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function Header({ navigation }) {
    const { auth } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [attendance, setAttendance] = useState(0);
    const [retryAttempts, setRetryAttempts] = useState(0);
    const [isRetryMaxValueReached, setIsRetryMaxValueReached] = useState(false);

    const retryAttemptsValue = 5;

    const handleDataFetch = async (sync) => {
        await fetchBasicDetails(setLoading, setRefreshing, setUserDetails, auth, setIsError, sync, setLastSynced);
    };

    const getAttendance = async () => {
        try {
            const localAttendance = await AsyncStorage.getItem("ATTENDANCE");
            if (localAttendance) {
                const parsedAttendance = JSON.parse(localAttendance)?.summary?.total_details?.agg_attendance;
                setAttendance(parsedAttendance ? parseInt(parsedAttendance) : 0);
            } else {
                setAttendance(userDetails?.data?.attendance ? parseInt(userDetails.data.attendance) : 0);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setAttendance(0);
        }
    };

    useEffect(() => {
        handleDataFetch(false);
    }, []);

    useEffect(() => {
        if (Object.keys(userDetails).length > 0) {
            getAttendance();
        }
    }, [userDetails]);

    const handleRetry = async () => {
        if (isError && retryAttempts < retryAttemptsValue) {
            console.log("Error reattempt block", retryAttempts, isError);

            setRetryAttempts((prev) => prev + 1);

            await handleDataFetch(false);

            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Fetching details again',
                text2: `Attempt ${retryAttempts + 1}`,
            });
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

    useEffect(() => {
        if (isError && !loading) {
            handleRetry();
        }
    }, [isError, loading]);


    return (
        <LinearGradient style={styles.container} colors={[colors.secondary, colors.primary]}>
            <View style={styles.header}>
                <View style={{ height: '20%', alignItems: 'center' }}></View>

                <View style={styles.headerContainer}>
                    <View style={styles.searchbarContainer}>
                        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('VertoSearch')}>
                            <Text style={styles.text1}>Search a Verto</Text>
                            <Octicons name='search' color={colors.whiteLight} size={18} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.iconContainer}>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('FriendRequests')}
                                style={styles.button2}><Octicons name='person-add' size={15}
                                    color={colors.whiteLight} /></TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Requests</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                style={styles.button2} disabled={loading}
                                onPress={loading ? () => { } : () => navigation.navigate('MyProfile')}>
                                <FontAwesome5 name='user' size={15} color={colors.whiteLight} />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 10 }}>Profile</Text>
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
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.AttendanceContainer} onPress={loading ? () => { } : () => navigation.navigate('Attendance')}>
                        <Text style={{ fontWeight: '500', color: colors.whiteLight }}>Attendance</Text>
                        {loading ?
                            <>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: 50,
                                        height: 50,
                                    }}
                                    source={require('../../../assets/lotties/loading1.json')}
                                />
                            </> :
                            <>
                                <AttendanceProgressBar size={50} attendance={attendance} />
                            </>
                        }
                    </TouchableOpacity>

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
        // backgroundColor:"yellow",
        flexDirection: "row"
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-center',
        height: '55%',
        // backgroundColor:'#00000026',
        backgroundColor: colors.blueTransparency,
        alignItems: 'center',
        marginBottom: 13,
        padding: 10,
        borderRadius: 15,
        // width: '95%'
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor:'red',
        width: '90%'
    },
    searchbarContainer: {
        width: '50%',
        height: '60%',
    },
    greeting: {
        width: '65%',
        overflow: 'hidden',
        paddingLeft: 5
    },
    AttendanceContainer: {
        width: '30%',
        height: 95,
        backgroundColor: colors.btn1,
        borderRadius: 25,
        alignItems: 'center',
        padding: 3,
        gap: 8
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
    text1: {
        color: colors.whiteLight
    },
    textSmall: { marginRight: 15, fontSize: 15, fontWeight: '400', color: 'white' },
    textMedium: { fontSize: 25, fontWeight: 'bold', color: 'white' },
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