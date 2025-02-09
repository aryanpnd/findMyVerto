import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles";
import LottieView from "lottie-react-native";

// import { Confetti } from "react-native-fast-confetti";

export default function CgpaDetails({ navigation }) {
    const route = useRoute();
    const { grades, sem, tgpa } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: `Sem-${sem} : ${tgpa}` });
    }, []);

    const getGradeDetails = (grade) => {
        switch (grade) {
            case "O":
                return { name: "Outstanding", color: ['#2657eb', '#de6161'] };
            case "A+":
                return { name: "Excellent", color: [colors.green, colors.green] };
            case "A":
                return { name: "Very Good", color: ["#56ab2f", "#a8e063"] };
            case "B+":
                return { name: "Good", color: [ "#799F0C","#ACBB78"] };
            case "B":
                return { name: "Above Average", color: ["#ffe259", "#ffa751"] };
            case "C":
                return { name: "Average", color: ["#fc4a1a", "#f7b733"] };
            case "D":
                return { name: "Marginal", color: ["#f857a6", "#ff5858"] };
            case "E":
                return { name: "Reappear", color: ["#c0392b", "#c0392b"] };
            case "G":
                return { name: "Backlog", color: ['#d31027', '#ea384d'] };
            case "F":
                return { name: "Backlog", color: ['#d31027', '#ea384d'] };
            default:
                return { name: "Reappear", color: ["#c0392b", "#c0392b"] };
        }
    };

    return (
        <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
            {
                grades?.map((subject, index) => {
                    const { name, color } = getGradeDetails(subject.grade);
                    return (
                        <View style={styles.card} key={index}>
                            <LinearGradient colors={color}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.recordContainer]}>
                                <Text style={styles.text1}>{subject.grade}</Text>
                                <Text style={{ fontSize: 12, fontWeight: "500", color: "white" }}>{name}</Text>
                            </LinearGradient>
                            <View style={{ width: "70%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={[
                                    styles.text2,
                                    (subject.grade === "O" ||subject.grade === "D"||subject.grade === "R"||subject.grade === "F"||subject.grade === "G"||subject.grade === "E") && { width: "70%" }
                                ]}>{subject.course_name}</Text>

                                {subject.grade === "O" && <LottieView source={require("../../../assets/lotties/congrats.json")} autoPlay loop style={{ height: 80, width: 80 }} />}
                                {subject.grade === "D" && <LottieView source={require("../../../assets/lotties/coffinGuys.json")} autoPlay loop style={{ height: 80, width: 80 }} />}
                                {(subject.grade === "R"||subject.grade === "F"||subject.grade === "G"||subject.grade === "E") && <LottieView source={require("../../../assets/lotties/skull.json")} autoPlay loop style={{ height: 80, width: 80 }} />}
                            </View>
                        </View>
                    );
                })
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        height: '100%',
        width: '100%',
    },
    scrollView: {
        padding: 5,
        paddingVertical: 20,
        gap: 10,
        alignItems: "center",
        backgroundColor: "white"
    },
    card: {
        height: HEIGHT(12),
        width: WIDTH(95),
        borderRadius: 20,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        // borderWidth: 1,
        // ...globalStyles.elevationMin
    },
    recordContainer: {
        height: "100%",
        width: "25%",
        borderRadius: 20,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text1: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    text2: {
        color: "grey",
        fontSize: 13,
        fontWeight: "500",
    },
});