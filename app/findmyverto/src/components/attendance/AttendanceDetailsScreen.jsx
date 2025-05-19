import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import SyncData from '../../components/miscellaneous/SyncData';
import AttendanceDetailsCard from '../../components/attendance/AttendanceDetailsCard';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { HEIGHT, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { ErrorMessage } from '../timeTable/ErrorMessage';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function AttendanceDetailsScreen({
    subjectCode,
    name,
    self = false,
    attendanceDetails,
    loading,
    refreshing,
    lastSynced,
    isError,
    onRefresh,
    navigation,
}) {
    const NoteHeader = () => (
        <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
                Keep your data accurate by syncing at or after the “Last Synced” timestamp.
            </Text>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <AttendanceDetailsCard key={index} details={item} />
    );

    const renderShimmers = () => (
        <FlatList
            data={Array.from({ length: 10 })}
            keyExtractor={(_, i) => `shimmer-${i}`}
            renderItem={() => <ShimmerPlaceHolder style={styles.shimmer} visible={false} />}
            contentContainerStyle={styles.shimmerContainer}
        />
    );

    const errorComponent = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ErrorMessage
                handleFetchTimetable={() => onRefresh(true)}
                timetableLoading={loading || refreshing}
                buttonHeight={45}
                ErrorMessage={"Attendance"}
            />
        </View>
    );

    return (
        <>
            <View style={[styles.header]}>
                {/* Back naviagtion button */}
                <View style={[styles.backBtn]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios' size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* title */}
                <View style={[styles.title]}>
                    <Text style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}>{subjectCode}</Text>
                </View>
            </View>

            <View style={{ zIndex: 2 }}>
                <Toast />
            </View>

            {isError ? (
                <View style={styles.errorContainer}>
                    <ErrorMessage
                        handleFetchTimetable={() => onRefresh(true)}
                        timetableLoading={loading || refreshing}
                        buttonHeight={45}
                        ErrorMessage={"Attendance Details"}
                    />
                </View>
            ) : (
                <View style={styles.container}>
                    <SyncData
                        time={lastSynced}
                        syncNow={() => onRefresh(true)}
                        self={self}
                        loader={true}
                        loading={refreshing || loading}
                    />

                    {loading ? (
                        renderShimmers()
                    ) : (
                        <FlatList
                            data={attendanceDetails[subjectCode] ?? []}
                            keyExtractor={(_, i) => `att-${i}`}
                            renderItem={renderItem}
                            ListHeaderComponent={NoteHeader}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <LottieView
                                        source={require('../../../assets/lotties/empty.json')}
                                        autoPlay
                                        loop
                                        style={styles.emptyLottie}
                                    />
                                    <Text style={styles.emptyText}>No attendance records found</Text>
                                </View>
                            }
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    // header
    header: {
        height: HEIGHT(8),
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
    shimmerContainer: { alignItems: 'center', gap: 10, paddingVertical: 20 },
    shimmer: { height: HEIGHT(10), width: WIDTH(95), borderRadius: 20 },
    noteContainer: {
        width: '100%',
        paddingVertical: HEIGHT(1),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light,
        borderRadius: 20,
        marginBottom: HEIGHT(1),
    },
    noteText: { fontSize: 12, color: colors.lightDark, textAlign: 'center' },
    listContent: { alignItems: 'center', paddingVertical: HEIGHT(2), paddingHorizontal: 10 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', height: HEIGHT(70) },
    emptyLottie: { height: HEIGHT(40), width: WIDTH(60), alignSelf: 'center' },
    emptyText: { fontSize: 16, color: 'grey', fontWeight: '500' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
    errorText: { fontSize: 16, color: colors.error }
});