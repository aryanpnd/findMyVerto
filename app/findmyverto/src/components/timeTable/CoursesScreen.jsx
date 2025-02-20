import { ScrollView, View } from "react-native"
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter"
import Toast from "react-native-toast-message"
import SyncData from "../miscellaneous/SyncData"
import OverlayLoading from "../miscellaneous/OverlayLoading"
import { ErrorMessage } from "./ErrorMessage"
import CoursesCard from "./CoursesCard"
import { colors } from "../../constants/colors"

export default function CoursesScreen({
    courses,
    isError,
    self,
    handleFetchCourses,
    timetableLoading,
    lastSynced,
    refreshing
 }) {
    return (
        <>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData self={true} syncNow={() => handleFetchCourses(true)} time={formatTimeAgo(lastSynced)} color={"white"} bg={colors.secondary} loader={true} loading={refreshing} />
            </View>
            {self && !isError && <OverlayLoading loading={timetableLoading} loadingText={"Syncing..."} />}

            {
                isError ?
                    <ErrorMessage handleFetchCourses={handleFetchCourses} timetableLoading={timetableLoading} buttonHeight={45} ErrorMessage={"timetable"} />
                    :
                    <ScrollView
                        contentContainerStyle={{ padding: 10, paddingBottom: 50, gap: 10 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            Object.keys(courses).map((course, index) => {
                                return (
                                    <CoursesCard key={index} subjectCode={course} course={courses[course]} />
                                )
                            })
                        }
                    </ScrollView>
            }
        </>
    )
}