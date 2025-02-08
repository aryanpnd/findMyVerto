import { ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyles, HEIGHT } from "../../constants/styles";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import SyncData from "../miscellaneous/SyncData";
import Toast from "react-native-toast-message";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { colors } from "../../constants/colors";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function CgpaScreen({
    cgpa,
    cgpaLoading,
    cgpaRefresh,
    isError,
    lastSynced,
    handleCgpaFetch,
    navigation
}) {
    return (
        <View>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={cgpaLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={()=>handleCgpaFetch(true)}
                    dataLoading={cgpaLoading}
                    self={!cgpaLoading}
                    color={"white"} bg={colors.secondary}
                    loader={true} loading={cgpaRefresh}/>
            </View>
            {cgpaLoading &&
                <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <ShimmerPlaceHolder key={index} style={styles.shimmer} visible={false} />
                    ))}
                </ScrollView>
            }

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={handleMarksFetch} timetableLoading={marksLoading} buttonHeight={45} ErrorMessage={"CGPA"} />
                    :
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.body} contentContainerStyle={styles.scrollView}>
                        <Text style={styles.sectionHeader}>Normal Semesters</Text>
                    </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        height: "97%",
        width: '100%',
        gap: HEIGHT(5),
        backgroundColor: "white"
    },
    shimmer: {
        width: '100%',
        height: HEIGHT(10),
        borderRadius: 25,
        ...globalStyles.elevationMin
    },
})