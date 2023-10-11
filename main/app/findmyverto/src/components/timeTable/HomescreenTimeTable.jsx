import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../constants/styles';
import Loading1 from '../miscellaneous/Loading1';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function HomescreenTimeTable() {

    const { auth } = useContext(AuthContext)
    const [timeTable, settimeTable] = useState([])
    const [day, setDay] = useState(0)
    const [loading, setLoading] = useState(false)


    async function fetchDataLocally() {
        try {
            setLoading(true)
            let userTimeTable = await AsyncStorage.getItem("TIMETABLE");
            if (!userTimeTable) {
                await axios.post(`${API_URL}/api/student/getStudentTimeTable`, { password: auth.pass }).then(async (result) => {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    const tt = formatTimetableToClasses(result.data)
                    settimeTable(tt)
                    setLoading(false)
                }).catch((err) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching Time table',
                        text2: `${err}`,
                    });
                    console.log({ "inside catch": err });
                    setLoading(false)
                })
                return
            }
            setLoading(false)
            const tt = formatTimetableToClasses(JSON.parse(userTimeTable))
            settimeTable(tt)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    function getDay() {
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        setDay(dayIndex);
    }

    function formatTimetableToClasses(ttToFormat) {
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        const tt = Object.entries(ttToFormat)[dayIndex][1]
        const classes = Object.entries(tt).filter(([_,value])=>value.length>1)
        return classes
    }

    useEffect(() => {
        fetchDataLocally();
        getDay()
    }, []);

    const printTT = () => {
        console.log(timeTable);
    }


    return (
        <>{
            loading? <Loading1 loading={loading} key={gap} loadAnim={"amongus"} loadingText={"Getting your Timetable"} loadingMsg={"it may take some seconds for the first time"}/>
            : 

            <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            snapToInterval={itemWidth + gap}>

            {
                timeTable?.map((value, index) => (
                    <>
                    <View key={index} style={[styles.item]}>
                        <TouchableOpacity onPress={()=>formatTimetable(timeTable)}>
                            <Text>click me</Text>
                        </TouchableOpacity>
                        <Text>{value[0]}</Text>
                    </View>
                </>
            ))}

        </ScrollView>
        }
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
    },
    item: {
        height: "100%",
        width: itemWidth,
        backgroundColor: 'white',
        marginRight: gap,
        borderRadius: 25,
    },
});