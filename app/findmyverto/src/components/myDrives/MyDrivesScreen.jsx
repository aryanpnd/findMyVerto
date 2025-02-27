import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import SyncData from "../miscellaneous/SyncData";
import formatTimeAgo from "../../../utils/helperFunctions/dateFormatter";
import DriveCard from "./DriveCard";
import { HEIGHT, WIDTH } from "../../constants/styles";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import { ErrorMessage } from "../timeTable/ErrorMessage";
import Button from "../miscellaneous/Button";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function MyDrivesScreen({
    drives,
    drivesLoading,
    drivesRefresh,
    isError,
    handleDrivesFetch,
    navigation,
    lastSynced,
}) {
    const [filteredDrives, setFilteredDrives] = useState(drives);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredDrives(drives);
        } else {
            const lowerText = searchQuery.toLowerCase();
            setFilteredDrives(
                drives.filter((drive) =>
                    drive.company.toLowerCase().includes(lowerText)
                )
            );
        }
    }, [searchQuery, drives]);

    return (
        <View style={{ backgroundColor: "white", flex: 1, gap: 10 }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={drivesLoading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleDrivesFetch(true)}
                    dataLoading={drivesLoading}
                    self={!drivesLoading}
                    loader={true}
                    loading={drivesRefresh}
                />
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder='Search by company name...'
                placeholderTextColor={'grey'}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {isError ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ErrorMessage handleFetchTimetable={()=>handleDrivesFetch(true)} timetableLoading={drivesLoading||drivesRefresh} buttonHeight={45} ErrorMessage={"Makeup"} />
                </View>
            ) : (
                <View style={styles.body}>
                    {drivesLoading ? (
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
                    ) : filteredDrives.length === 0 ? (
                        <View style={styles.noDrivesContainer}>
                            <LottieView
                                source={require("../../../assets/lotties/empty.json")}
                                autoPlay
                                loop
                                style={styles.lottie}
                            />
                            <Text style={[styles.text1, { color: "grey" }]}>No Drives found</Text>
                            <View style={{height:40, width:150, marginTop:10}}>
                            <Button
                                bg={"black"}
                                loading={drivesLoading || drivesRefresh}
                                onPress={async () => await handleDrivesFetch(true)}
                                title={"Retry"}
                                textStyles={{ fontSize: 15 }}
                                styles={{ hieght: 10 }}
                                />
                                </View>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredDrives}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <DriveCard drive={item} navigation={navigation} />
                            )}
                            contentContainerStyle={{ paddingBottom: HEIGHT(5), paddingHorizontal: 5 }}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingHorizontal: 10,
    },
    searchBar: {
        width: WIDTH(95),
        height: HEIGHT(6),
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        alignSelf: "center",
        marginBottom: 10,
        borderColor: "grey",
        backgroundColor: "white",
    },
    shimmer: {
        height: HEIGHT(20),
        width: WIDTH(95),
        borderRadius: 20,
        marginVertical: HEIGHT(1),
    },
    noDrivesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        height: HEIGHT(50),
        width: WIDTH(80),
        alignSelf: "center",
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});