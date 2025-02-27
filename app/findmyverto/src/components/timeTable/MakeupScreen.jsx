import { FlatList, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import SyncData from "../miscellaneous/SyncData";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import { ErrorMessage } from "./ErrorMessage";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import MakeupCard from "./MakeupCard";
import { colors } from "../../constants/colors";
import { HEIGHT, WIDTH } from "../../constants/styles";
import LottieView from "lottie-react-native";


const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);


export default function MakeupScreen({
    makeup,
    makeupLoading,
    makeupRefresh,
    isError,
    lastSynced,
    handleMakeupFetch,
    navigation
}) {
    return (
        <View style={{ backgroundColor: "white", flex: 1, gap: 10 }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={makeupLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleMakeupFetch(true)}
                    color={"white"} bg={colors.secondary}
                    dataLoading={makeupLoading}
                    self={!makeupLoading}
                    loader={true}
                    loading={makeupRefresh}
                />
            </View>

            {isError ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ErrorMessage handleFetchTimetable={() => handleMakeupFetch(true)} timetableLoading={makeupLoading || makeupRefresh} buttonHeight={45} ErrorMessage={"Makeup"} />
                </View>
            ) : (
                <View style={styles.body}>
                    {makeupLoading ? (
                        <FlatList
                            data={Array.from({ length: 5 })}
                            keyExtractor={(_, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={() => (
                                <ShimmerPlaceHolder
                                    style={styles.shimmer}
                                    visible={false}
                                />
                            )}
                            contentContainerStyle={{ alignItems: 'center' }}
                        />
                    ) : (
                        <FlatList
                            data={makeup}
                            renderItem={({ item }) => (
                                <MakeupCard makeup={item} navigation={navigation} />
                            )}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{gap: 10,paddingVertical: 10, paddingHorizontal: 8}}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <LottieView
                                        source={require("../../../assets/lotties/empty.json")}
                                        autoPlay
                                        loop
                                        style={styles.lottie}
                                    />
                                    <Text style={[styles.text1, { color: "grey" }]}>No Makeups found</Text>
                                    <Text style={[styles.text2, { color: "grey" }]}>if you think it's an error then try syncing again</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    shimmer: {
        height: HEIGHT(20),
        width: WIDTH(95),
        borderRadius: 20,
        marginVertical: HEIGHT(1),
    },
    emptyContainer: {
        height: HEIGHT(70),
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
    text1: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text2: {
        fontSize: 14,
    }
})