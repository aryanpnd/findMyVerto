import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../context/Auth';
import Loading1 from '../miscellaneous/Loading1';
import LottieView from 'lottie-react-native';
import ClassesTodayCards from './ClassesTodayCards';
import { colors } from '../../constants/colors';
import isTimeEqual from '../../utils/helperFunctions/funtions';
import { AppContext } from '../../../context/MainApp';
import { fetchTimetable } from '../../utils/fetchUtils/timeTableFetch';
import Button from '../miscellaneous/Button';
import { useFocusEffect } from '@react-navigation/native';
import { HEIGHT } from '../../constants/styles';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const HomescreenTimeTable = forwardRef(({ navigation }, ref) => {
    const { auth } = useContext(AuthContext)
    const { timetableLoading, setTimetableLoading } = useContext(AppContext)
    const [classesToday, setClassesToday] = useState(0)
    const [timeTable, settimeTable] = useState([])
    const [lastSynced, setLastSynced] = useState("")
    const [lastUpdated, setLastUpdated] = useState("")
    const [day, setDay] = useState(0)
    const [classesOver, setClassesOver] = useState(false)

    const [refreshing, setRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        setDay(new Date().getDay());
        handleFetchTimetable();
    }, []);

    function today() {
        const td = new Date()
        setDay(td.getDay())
    }

    const handleFetchTimetable = async () => {
        if (timetableLoading) return
        fetchTimetable(setTimetableLoading, setRefreshing, settimeTable, setClassesToday, auth, setIsError, false, true, setLastSynced, setLastUpdated)
    }

    useEffect(() => {
        today()
        handleFetchTimetable()
    }, []);
    useEffect(() => {
        setClassesOver(timeTable && timeTable.length > 0
            && isTimeEqual(timeTable[timeTable.length - 1]?.time, true))
    }, [timeTable])
    useImperativeHandle(ref, () => ({
        handleFetchTimetable,
        today
    }));

    useFocusEffect(
        useCallback(() => {
            if (timeTable.length > 0) {
                const ongoingIndex = timeTable.findIndex(classItem => isTimeEqual(classItem.time));
                if (ongoingIndex !== -1 && scrollViewRef.current) {
                    const scrollPosition = ongoingIndex * (itemWidth + gap) - gap;
                    scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
                }
            }
        }, [timeTable])
    );


    return (
        <>
            {isError ?
                <ErrorMessage handleFetchTimetable={handleFetchTimetable} timetableLoading={timetableLoading} />
                :
                timetableLoading ?
                    <Loading1 loading={timetableLoading} loadAnim={"amongus"} loadingText={"Getting your Timetable"} loadingMsg={"it may take some seconds for the first time"} textColor={"black"} />
                    :
                    !timeTable[0]?.time ?
                        <NoClassesComponent day={day} />
                        :
                        <View style={{ width: "100%", justifyContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 20 }}>
                                <Text style={styles.text1}>
                                    <Text style={{ color: "grey" }}>Classes today:</Text> {
                                        timeTable && timeTable.length > 0 && isTimeEqual(timeTable[timeTable.length - 1]?.time, true) ? "Over" : classesToday
                                    }
                                </Text>
                                {timeTable.length == 0 ?
                                    <></> :
                                    <Text style={styles.text1}>
                                        {days[day]}
                                    </Text>
                                }

                            </View>

                            {
                                day === 0 ?
                                    <SundayMessage navigation={navigation} />
                                    :
                                    <ScrollView
                                        ref={scrollViewRef}
                                        horizontal
                                        nestedScrollEnabled={true}
                                        decelerationRate="normal"
                                        contentContainerStyle={[styles.scrollView,classesOver&&{width:"100%"}]}
                                        showsHorizontalScrollIndicator={false}
                                        bounces={Platform.OS === 'ios' ? false : undefined}
                                        alwaysBounceVertical={false}
                                        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}>

                                        {
                                            classesOver
                                                ?
                                                <NoClassesMessage />
                                                :
                                                timeTable?.map((value, index) => (
                                                    <ClassesTodayCards key={index} value={value} index={index} navigation={navigation} />
                                                ))
                                        }

                                    </ScrollView>
                            }
                        </View>
            }
        </>
    );
})
export default HomescreenTimeTable;

const NoClassesComponent = ({ day }) => {
    return (
        <View style={{ width: "100%" }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginHorizontal: 20 }}>
                <Text style={styles.text1}>
                    {days[day]}
                </Text>
            </View>
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                <NoClassesMessage />
            </View>
        </View>
    )
}

const NoClassesMessage = () => {
    return (
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
            <Text style={styles.text1}>Have fun...</Text>
        </View>
    )
}

const SundayMessage = ({ navigation }) => {
    return (
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
    )
}

const ErrorMessage = ({ handleFetchTimetable, timetableLoading }) => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", height: "80%", gap: 8 }}>
            <LottieView
                autoPlay
                style={{
                    width: 150,
                    height: 150,
                }}
                source={require('../../../assets/lotties/error.json')}
            />
            <Text>...while getting the timetable</Text>
            <View style={{ height: "20%", width: "50%" }}>
                <Button
                    bg={"black"}
                    loading={timetableLoading}
                    onPress={async () => await handleFetchTimetable()}
                    title={"Retry"}
                    textStyles={{ fontSize: 15 }}
                    styles={{ hieght: 10 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        padding: 10,
        alignItems: 'center',
        // backgroundColor: "yellow",
        // width:"100%",
        justifyContent: 'center',
        maxHeight: HEIGHT(30),
    },
    text1: {
        color: "grey",
        fontWeight: "500"
    }

});