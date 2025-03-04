import { StyleSheet, View, Text, Image } from "react-native";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../constants/styles";

export default function CoursesCard({ course, subjectCode }) {
    return (
        <View style={styles.card}>
            <View style={styles.titleContainer}>
                <Text style={styles.text1}>[{subjectCode}] {course.course_title}</Text>
            </View>

            <View style={styles.divider}></View>

            <View style={styles.infoContainer1}>
                <Text style={styles.text2}>Lectures: {course.lectures}</Text>
                <Text style={styles.text2}>Tutorials: {course.tutorials}</Text>
                <Text style={styles.text2}>Practicals: {course.practical}</Text>
            </View>

            <View style={styles.infoContainer1}>
                <Text style={styles.text2}>Type: {course.course_type}</Text>
                <Text style={styles.text2}>Credits: {course.credits}</Text>
            </View>

            <View style={styles.infoContainer2}>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', width: '55%' }}>
                    <Image
                        source={require("../../../assets/icons/teacher.png")}
                        style={{ height: 15, width: 15 }}
                        transition={1000}
                    />
                    <Text style={styles.text2}>{course.faculty_name}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", gap: 5, alignItems: 'center', width: '30%' }}>
                    <Image
                        source={require("../../../assets/icons/building.png")}
                        style={{ height: 15, width: 15 }}
                        transition={1000}
                    />
                    <Text style={styles.text2}>Cabin: {course.cabin}</Text>
                </View>
            </View>

            <View style={[styles.infoContainer2,{alignSelf:'flex-end'}]}>
                <Text style={[styles.text2,{fontSize:11}]}>last updated: {course.last_updated}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        ...globalStyles.elevationMin
    },
    titleContainer: {
    },
    divider: {
        height: 1,
        backgroundColor: colors.disabledBackground,
        marginVertical: 5,
        marginTop: 10,
    },
    infoContainer1: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer2: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
    },

    text1: {
        color: "grey",
        fontSize: 14,
        fontWeight: 'bold'
    },
    text2: {
        // color: 'white',
        color: "grey",
    },
});