import { View, Text, FlatList, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
import { colors } from "../../constants/colors";

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
    const [activeFilter, setActiveFilter] = useState("All");
    const [driveCounts, setDriveCounts] = useState({
        All: 0,
        Registered: 0,
        NotRegistered: 0,
        Open: 0
    });

    // Filter options
    const filterOptions = [
        { id: "All", label: "All Drives" },
        { id: "Open", label: "Open" },
        { id: "Registered", label: "Registered" },
        { id: "NotRegistered", label: "Not Registered" },
    ];

    // Calculate counts for each filter category
    useEffect(() => {
        if (drives && drives.length) {
            const counts = {
                All: drives.length,
                Open: drives.filter(drive => 
                    drive.status === "Open").length,
                Registered: drives.filter(drive => 
                    drive.registered !== "No" && 
                    drive.registered !== "Click to Register").length,
                NotRegistered: drives.filter(drive => 
                    drive.registered === "No" || 
                    drive.registered === "Click to Register").length
            };
            setDriveCounts(counts);
        } else {
            setDriveCounts({
                All: 0,
                Registered: 0,
                NotRegistered: 0,
                Open: 0
            });
        }
    }, [drives]);

    // Apply both text search and category filter
    useEffect(() => {
        let result = drives;
        
        // First apply category filter
        if (activeFilter !== "All") {
            switch (activeFilter) {
                case "Open":
                    result = drives.filter(drive => 
                        drive.status === "Open");
                    break;
                case "Registered":
                    result = drives.filter(drive => 
                        drive.registered !== "Click to Register" && 
                        drive.registered !== "No");
                    break;
                case "NotRegistered":
                    result = drives.filter(drive => 
                        drive.registered === "Click to Register" ||
                        drive.registered === "No");
                    break;
            }
        }
        
        // Then apply text search
        if (searchQuery.trim() !== "") {
            const lowerText = searchQuery.toLowerCase();
            result = result.filter((drive) =>
                drive.company.toLowerCase().includes(lowerText)
            );
        }
        
        setFilteredDrives(result);
    }, [searchQuery, drives, activeFilter]);

    const handleFilterSelect = (filterId) => {
        setActiveFilter(filterId);
    };

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

            {/* Filter Chips */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
            >
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.filterChip,
                            activeFilter === option.id && styles.activeFilterChip
                        ]}
                        onPress={() => handleFilterSelect(option.id)}
                    >
                        <Text 
                            style={[
                                styles.filterChipText,
                                activeFilter === option.id && styles.activeFilterChipText
                            ]}
                        >
                            {option.label} {driveCounts[option.id] > 0 && `(${driveCounts[option.id]})`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {isError ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ErrorMessage handleFetchTimetable={()=>handleDrivesFetch(true)} timetableLoading={drivesLoading||drivesRefresh} buttonHeight={45} ErrorMessage={"Makeup"} />
                </View>
            ) : (
                    drivesLoading ? (
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
                            contentContainerStyle={{ 
                                paddingBottom: HEIGHT(5), 
                                paddingHorizontal: WIDTH(2.5)
                             }}
                        />
                    )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
    filterContainer: {
        height: HEIGHT(6),
        paddingHorizontal: WIDTH(2.5),
        paddingBottom: HEIGHT(1),
        gap: WIDTH(2),
    },
    filterChip: {
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT(4),
        paddingHorizontal: WIDTH(4),
        paddingVertical: HEIGHT(0.8),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.lightDark,
        backgroundColor: 'white',
    },
    activeFilterChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightDark,
    },
    activeFilterChipText: {
        color: 'white',
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