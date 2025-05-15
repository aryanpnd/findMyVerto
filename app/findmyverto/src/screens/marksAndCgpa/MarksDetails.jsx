import { useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

export default function MarksDetails({ navigation }) {
    const route = useRoute();
    const { subjects, year, sem, colors } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: `${year}${year === "1" ? "st" : year === "2" ? "nd" : year === "3" ? "rd" : "th"} Year - ${sem}` });
    }, []);

    // Helper function to parse and calculate totals
    const calculateTotals = (marksData) => {
        let totalMarksObtained = 0, totalMarksPossible = 0;
        let totalWeightObtained = 0, totalWeightPossible = 0;
    
        marksData.forEach(({ marks, weightage }) => {
            const [obtainedMarks, possibleMarks] = marks.split("/").map(Number);
            const [obtainedWeight, possibleWeight] = weightage.split("/").map(Number);
    
            totalMarksObtained += obtainedMarks;
            totalMarksPossible += possibleMarks;
            totalWeightObtained += obtainedWeight;
            totalWeightPossible += possibleWeight;
        });
    
        const formatValue = (value) =>
            value % 1 === 0 ? value.toString() : value.toFixed(2);
    
        return {
            totalMarksText: `${formatValue(totalMarksObtained)}/${formatValue(totalMarksPossible)}`,
            totalWeightText: `${formatValue(totalWeightObtained)}/${formatValue(totalWeightPossible)}`
        };
    };
    

    return (
        <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
            {
                Object.keys(subjects).map((key, index) => (
                    <View style={styles.card} key={index}>
                        <View>
                            <Text style={styles.subNameText}>{key}</Text>
                        </View>

                        <View style={{ gap: 10, marginTop: 10 }}>
                            {
                                subjects[key].map((marks, subIndex) => (
                                    <View key={subIndex}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={[styles.marksHeading, { width: WIDTH(40) }]}></Text>
                                            <Text style={styles.marksHeading}>Marks</Text>
                                            <Text style={styles.marksHeading}>Weightage</Text>
                                        </View>
                                        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                                            <Text style={styles.marksText}>
                                                {marks.weightage.split("/")[0] === "Awaited" ? (
                                                    <>
                                                        <FontAwesome6
                                                            name="clock"
                                                            size={12}
                                                            color="black"
                                                        />
                                                        <Text> /{marks.weightage.split("/")[1]}</Text>
                                                    </>
                                                ) : (
                                                    marks.weightage
                                                )}
                                            </Text>

                                            <Text style={styles.marksText}>
                                                {marks.marks.split("/")[0] === "Awaited" ? (
                                                    <>
                                                        <FontAwesome6
                                                            name="clock"
                                                            size={12}
                                                            color="black"
                                                        />
                                                        <Text> /{marks.marks.split("/")[1]}</Text>
                                                    </>
                                                ) : (
                                                    marks.marks
                                                )}
                                            </Text>
                                            <Text style={[styles.marksHeading, { width: WIDTH(40) }]}>{marks.type}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                            {/* Totals Section */}
                            {
                                (() => {
                                    const totals = calculateTotals(subjects[key]);
                                    return (
                                        <LinearGradient colors={colors}
                                            start={{ x: 0, y: 0 }} // Start from the left
                                            end={{ x: 1, y: 0 }}
                                            style={{ marginTop: 5, padding: 10, borderRadius: 10 }}>
                                            {/* <View style={{ marginTop: 15, }}> */}
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <Text style={[styles.marksHeading, { width: WIDTH(40), color: "white" }]}>Total</Text>
                                                <Text style={[styles.marksText, { color: "white", fontWeight: "bold" }]}>{totals.totalMarksText}</Text>
                                                <Text style={[styles.marksText, { color: "white", fontWeight: "bold" }]}>{totals.totalWeightText}</Text>
                                            </View>
                                            {/* </View> */}
                                        </LinearGradient>
                                    );
                                })()
                            }
                        </View>
                    </View>
                ))
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        height: "95%",
        width: '100%',
        gap: HEIGHT(5),
        backgroundColor: "white"
    },
    scrollView: {
        gap: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    card: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.disabledBackground,
        // ...globalStyles.elevation
    },
    subNameText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black"
    },
    marksHeading: {
        fontSize: 12,
        fontWeight: "bold",
        color: "grey"
    },
    marksText: {
        fontSize: 15,
        color: "grey"
    }
});
