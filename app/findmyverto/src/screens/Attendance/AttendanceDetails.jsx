import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import AttendanceDetailsCard from "../../components/attendance/AttendanceDetailsCard";

const { height, width } = Dimensions.get('window');

export default function AttendanceDetails({ navigation }) {
    const route = useRoute();
    const { Details,subject_code } = route.params
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={[styles.header]}>
                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* title */}
                <View style={[styles.title]}>
                    <Text style={{ fontSize: 18, fontWeight: "500", textAlign:"center" }}>{subject_code}</Text>
                </View>
            </View>
            <ScrollView style={styles.body} contentContainerStyle={{ alignItems: 'center',gap:10,paddingBottom:20 }}>
                {
                    Details?.map((value, index) => {
                        return (
                            <AttendanceDetailsCard key={index} details={value} />
                        );
                    })
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        // justifyContent:"space-between",
        height: '100%',
    },

    // header
    header: {
        height: 0.08 * height,
        width: '100%',
        flexDirection: "row",
        padding: 10,
        gap: 10,
    },
    backBtn: {
        width: "10%",
        justifyContent: "center",
        alignItems: 'center',
    },
    title: {
        alignItems: "center",
        justifyContent: "center"
    },

    // body
    body: {
        height: "92%",
        width: '100%',
        gap: height * 0.05,
    },
    cardContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    }
});