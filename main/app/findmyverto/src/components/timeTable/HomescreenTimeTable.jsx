import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;

export default function HomescreenTimeTable() {

    const { auth } = useContext(AuthContext)
  const [timeTable, settimeTable] = useState({})
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    async function fetchDataLocally() {
        try {
            setLoading(true)
            let userTimeTable = await AsyncStorage.getItem("TIMETABLE");
            if (!userTimeTable) {
                await axios.post(`${API_URL}/api/student/getStudentTimeTable`, { password: auth.pass }).then(async (result) => {
                    await AsyncStorage.setItem("TIMETABLE", JSON.stringify(result.data));
                    settimeTable(result.data)
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
            settimeTable(JSON.parse(userTimeTable))
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }
    fetchDataLocally();

}, []);

const printTT = ()=>{
    console.log(timeTable);
}

    
    return (
        <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            snapToInterval={itemWidth + gap}>

            {Object.entries(timeTable)?.slice(0, -1).map((value,index) => (
                <>
                <View key={index} style={styles.item}>
                    <TouchableOpacity onPress={()=>console.log(value)}>
                        <Text>click me</Text>
                    </TouchableOpacity>
                        <Text>{value[0]}</Text>
                </View>
                </>
            ))}
            
        </ScrollView>
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
        backgroundColor: 'darkred',
        marginRight: gap,
        borderRadius: 25,
    },
});