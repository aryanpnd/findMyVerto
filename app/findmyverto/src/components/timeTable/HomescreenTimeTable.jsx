import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading1 from '../miscellaneous/Loading1';
import LottieView from 'lottie-react-native';
import ClassesTodayCards from './ClassesTodayCards';
import { colors } from '../../constants/colors';
import formatTimetableToClasses from '../../constants/timetableToClassFormatter';
import getDay from '../../constants/getDay';
import Toast from 'react-native-toast-message';
import isTimeEqual from '../../constants/funtions';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function HomescreenTimeTable({ navigation, setClassesToday, timeTable, settimeTable, today }) {
    const { auth } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [day, setDay] = useState(1)

    const [refreshing, setRefreshing] = useState(false);

    async function fetchDataLocally() {
        try {
            setLoading(true)
            setRefreshing(true)
            let userTimeTable = await AsyncStorage.getItem("TIMETABLE");
            if (!userTimeTable) {
                await axios.post(`${API_URL}/api/student/getStudentTimeTable`, { password: auth.pass }).then(async (result) => {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    const tt = formatTimetableToClasses(result.data)
                    settimeTable(tt)
                    setClassesToday(tt.length)
                    setLoading(false)
                    setRefreshing(false)
                }).catch((err) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching Time table',
                        text2: `${err}`,
                    });
                    console.log({ "inside catch": err });
                    setLoading(false)
                    setRefreshing(false)
                })
                return
            }
            setLoading(false)
            setRefreshing(false)
            const tt = formatTimetableToClasses(JSON.parse(userTimeTable))
            setClassesToday(tt.length)
            settimeTable(tt)
            console.log({ "from local": tt });

        } catch (error) {
            console.error(error);
            setLoading(false)
            setRefreshing(false)
        }
    }


    useEffect(() => {
        getDay(setDay)
        fetchDataLocally();
    }, []);

    return (
        <>
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
                                timeTable && timeTable.length > 0 && isTimeEqual(timeTable[timeTable.length - 1][0], true) ?
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