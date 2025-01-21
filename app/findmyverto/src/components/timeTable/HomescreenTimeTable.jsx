import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading1 from '../miscellaneous/Loading1';
import LottieView from 'lottie-react-native';
import ClassesTodayCards from './ClassesTodayCards';
import { colors } from '../../constants/colors';
import formatTimetable from '../../constants/timetableFormatter';
import getDay from '../../constants/getDay';
import Toast from 'react-native-toast-message';
import isTimeEqual from '../../constants/funtions';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export default function HomescreenTimeTable({ navigation }) {
    const { auth } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [classesToday, setClassesToday] = useState(0)
    const [timeTable, settimeTable] = useState([])
    const [day, setDay] = useState(0)

    function today() {
        const td = new Date()
        setDay(td.getDay())
    }
    useEffect(() => {
        today()
    }, [])


    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);

    async function fetchDataLocally() {
        try {
            console.log("fetching data locally");
            setLoading(true)
            setRefreshing(true)
            let userTimeTableRaw = await AsyncStorage.getItem("TIMETABLE");
            let userTimeTable = userTimeTableRaw ? JSON.parse(userTimeTableRaw) : null;
            if (!userTimeTable) {
                console.log("fetching data from server -1");
                if (!userTimeTable || userTimeTable.status === false) {
                    console.log("fetching data from server -2");
                    const result = await axios.post(`${API_URL}/student/timetable`, { password: auth.password, reg_no: auth.reg_no });
                    if (result.data.status) {
                        console.log("data fetched");
                        await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                        const tt = formatTimetable(result.data.data.time_table, result.data.data.courses, true)
                        settimeTable(tt)
                        setClassesToday(tt.length)
                    } else {
                        console.log("error fetching data");
                        Toast.show({
                            type: 'error',
                            text1: `${result.data.message}`,
                            text2: `${result.data.errorMessage}`,
                        });
                    }
                }

            } else {
                console.log("data fetched locally");
                const tt = formatTimetable(userTimeTable.data.time_table, userTimeTable.data.courses, true)
                console.log(tt);
                console.log(typeof tt);
                console.log(tt.length);
                setClassesToday(tt.length)
                settimeTable(tt)
            }
            setLoading(false)
            setRefreshing(false)

        } catch (error) {
            console.error(error);
            setLoading(false)
            setRefreshing(false)
            setIsError(true)
        }
    }


    useEffect(() => {
        getDay(setDay)
        // fetchDataLocally();
    }, []);

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={styles.text1}>
                    <Text style={{ color: "grey" }}>Classes today:</Text> {timeTable && timeTable.length > 0 && isTimeEqual(timeTable[timeTable.length - 1][0], true) ? "Over" : classesToday}
                </Text>
                {timeTable.length == 0 ?
                    <></> :
                    <Text style={styles.text1}>
                        {days[day]}
                    </Text>
                }

            </View>
            {
                loading ? <Loading1 loading={loading} key={gap} loadAnim={"amongus"} loadingText={"Getting your Timetable"} loadingMsg={"it may take some seconds for the first time"} />
                    :
                    day === 0 ?
                        <View style={{ alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <LottieView
                                autoPlay
                                style={{
                                    width: 100,
                                    height: 100,
                                }}
                                source={require('../../../assets/lotties/sloth.json')}
                            />
                            <Text style={styles.text1}>It's Sunday, No classes Today</Text>

                            <TouchableOpacity style={{ flexDirection: 'row', gap: 5, backgroundColor: colors.btn1, paddingHorizontal: 15, paddingVertical: 3, borderRadius: 10 }} onPress={() => navigation.navigate('Timetable')}>
                                <Text style={{ fontSize: 12, color: 'grey' }}>View Timetable</Text>
                            </TouchableOpacity>
                        </View>
                        :

                        <ScrollView
                            horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            contentContainerStyle={styles.scrollView}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={itemWidth + gap}
                            refreshControl={
                                <RefreshControl
                                    tintColor={colors.secondary}
                                    colors={[colors.secondary]}
                                    refreshing={refreshing}
                                    onRefresh={() => {
                                        fetchDataLocally()
                                        getDay(setDay)
                                        today()
                                    }}
                                />
                            }
                        >

                            {   //checking if the classes are over
                                !timeTable && timeTable.length > 0
                                    && isTimeEqual(timeTable[timeTable.length - 1].time, true)
                                    ?
                                    <View style={{ alignItems: "center", justifyContent: "center", gap: 8, width: width * 0.85 }}>
                                        <LottieView
                                            autoPlay
                                            style={{
                                                width: 100,
                                                height: 100,
                                            }}
                                            source={require('../../../assets/lotties/sleep.json')}
                                        />
                                        <Text style={styles.text1}>No classes are left for today</Text>
                                    </View>
                                    :
                                    timeTable?.map((value, index) => (
                                        <ClassesTodayCards key={index} value={value} index={index} />
                                    ))
                            }

                            {
                                timeTable && timeTable.length === 0 &&
                                <View style={{ alignItems: "center", justifyContent: "center", gap: 8, width: width * 0.85 }}>
                                    <LottieView
                                        autoPlay
                                        style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                        source={require('../../../assets/lotties/sleep.json')}
                                    />
                                    <Text style={styles.text1}>No classes for today</Text>
                                </View>

                            }

                        </ScrollView>
            }
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    text1: {
        color: "grey",
        fontWeight: "500"
    }

});