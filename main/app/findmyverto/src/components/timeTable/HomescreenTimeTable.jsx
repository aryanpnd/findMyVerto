import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading1 from '../miscellaneous/Loading1';
import { LinearGradient } from 'expo-linear-gradient';
import getTime from '../../constants/funtions';
import { AppContext } from '../../../context/MainApp';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function HomescreenTimeTable({ setClassesToday }) {

    const { auth } = useContext(AuthContext)
    const { courses } = useContext(AppContext)
    const [timeTable, settimeTable] = useState([])
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
                    setClassesToday(tt.length)
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
            setClassesToday(tt.length)
            settimeTable(tt)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }


    function formatTimetableToClasses(ttToFormat) {
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        const tt = Object.entries(ttToFormat)[dayIndex][1]
        const classes = Object.entries(tt).filter(([_, value]) => value.length > 1)
        return classes
    }

    useEffect(() => {
        fetchDataLocally();
    }, []);


    return (
        <>{
            loading ? <Loading1 loading={loading} key={gap} loadAnim={"amongus"} loadingText={"Getting your Timetable"} loadingMsg={"it may take some seconds for the first time"} />
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
                            <LinearGradient
                                key={index}
                                colors={getTime(value[0])?['#11998e', '#38ef7d']:["white", "white"]}
                                style={styles.cardContainer}
                                start={{ x: 0, y: 0 }} // Start from the left
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={getTime(value[0])?styles.text2:styles.text1}>{value[1]?.split("/")[1].split(" ")[2].split(":")[1]}</Text>
                                <Text style={getTime(value[0])?styles.text2:styles.text1}>{courses[value[1]?.split("/")[1].split(" ")[2].split(":")[1]]}</Text>
                                <Text style={getTime(value[0])?styles.text2:styles.text1}>{value[0]}</Text>
                                <Text style={getTime(value[0])?styles.text2:styles.text1}>{value[1]}</Text>
                                <TouchableOpacity onPress={()=>console.log(courses)}>
                                    <Text>Press</Text>
                                </TouchableOpacity>
                            </LinearGradient>
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
    cardContainer: {
        height: "100%",
        width: itemWidth,
        backgroundColor: 'white',
        marginRight: gap,
        borderRadius: 25,
        padding:10
    },
    text1:{
        color:'#2d3436',
    },
    text2:{
        color:'white',
    }
});