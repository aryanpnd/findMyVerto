import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    FlatList,
    RefreshControl,
    ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { AuthContext } from '../../../context/Auth';
import StudentCard from '../../components/vertoSearch/StudentCard';
import EmptyRequests from '../../components/miscellaneous/EmptyRequests';
import { StatusBar } from 'expo-status-bar';
import TimetableScreenShimmer from '../../components/shimmers/TimetableScreenShimmer';
import { HEIGHT, WIDTH } from '../../constants/styles';
import { AppContext } from '../../../context/MainApp';
import { friendsStorage } from '../../../utils/storage/storage';
import { handleBackNavigation } from '../../../utils/navigation/navigationService';
import { fetchFriends } from '../../../utils/fetchUtils/handleFriends/handleFriends';

const { height } = Dimensions.get('window');

export default function Friends({ navigation }) {
    const { auth } = useContext(AuthContext);
    const { friendsRefreshing, setFriendsRefreshing } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFocused, setFocused] = useState(false);

    const [friends, setFriends] = useState([]);
    const [totalFriends, setTotalFriends] = useState(0);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSection, setSelectedSection] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Function to apply current filters to friends list
    const applyCurrentFilters = (friendsList) => {
        let filtered = [...friendsList];

        // Apply section filter if not 'All'
        if (selectedSection !== 'All') {
            filtered = filtered.filter(friend => friend.section === selectedSection);
        }

        // Apply search filter if there's a search query
        if (searchQuery !== '') {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((friend) => {
                return (
                    friend.name.toLowerCase().includes(lowerCaseQuery) ||
                    friend.reg_no.toLowerCase().includes(lowerCaseQuery) ||
                    friend.section.toLowerCase().includes(lowerCaseQuery)
                );
            });
        }

        return filtered;
    };

    // Watch for changes to the friends array and reapply filters
    useEffect(() => {
        if (friends.length > 0) {
            setFilteredFriends(applyCurrentFilters(friends));
        }
    }, [friends, selectedSection, searchQuery]);

    // On mount, try to load friends from local storage first, then fetch from API.
    useEffect(() => {
        const loadLocalFriends = async () => {
            try {
                const friendsLocally = friendsStorage.getString("FRIENDS");
                if (friendsLocally) {
                    const parsedFriends = JSON.parse(friendsLocally);
                    setFriends(parsedFriends);
                    const friendsCount = friendsStorage.getNumber("FRIENDS-COUNT");
                    if (friendsCount) {
                        setTotalFriends(friendsCount);
                    }
                }
            } catch (error) {
                console.error("Error reading local storage", error);
            }
            // Then fetch from API to update the list
            fetchFriends({
                auth,
                pageNumber: 1,
                append: false,
                currentFriends: friends,
                setFriends,
                setTotalFriends,
                setCurrentPage,
                setTotalPages,
                setLoading,
                setRefreshing,
                setFilteredFriends: (newFriends) => {
                    // No need to manually set filtered friends here
                    // The useEffect watching friends will handle it
                },
            });
        };
        loadLocalFriends();
    }, []);

    // Listen to a global refresh flag if needed.
    useEffect(() => {
        if (friendsRefreshing) {
            fetchFriends({
                auth,
                pageNumber: 1,
                append: false,
                currentFriends: friends,
                setFriends,
                setTotalFriends,
                setCurrentPage,
                setTotalPages,
                setLoading,
                setRefreshing,
                setFilteredFriends: (newFriends) => {
                    // No need to manually set filtered friends here
                    // The useEffect watching friends will handle it
                },
            });
            setFriendsRefreshing(false);
        }
    }, [friendsRefreshing]);

    // Extract unique sections from friends
    const getUniqueSections = () => {
        // Get unique sections
        const sections = friends.map(friend => friend.section);
        const uniqueSections = [...new Set(sections)];

        // Create an object to count friends per section
        const sectionCounts = {};
        uniqueSections.forEach(section => {
            sectionCounts[section] = friends.filter(friend => friend.section === section).length;
        });

        // Count total friends
        const totalCount = friends.length;

        // Return array with All and unique sections with counts
        return [
            { name: 'All', count: totalCount },
            ...uniqueSections.map(section => ({
                name: section,
                count: sectionCounts[section]
            }))
        ];
    };

    // Filter by section
    const filterBySection = (section) => {
        setSelectedSection(section);
        // No need to manually set filtered friends here
        // The useEffect watching selectedSection will handle it
    };

    // Search filter logic.
    const updateSearchQuery = (text) => {
        setSearchQuery(text);
        // No need to manually set filtered friends here
        // The useEffect watching searchQuery will handle it
    };

    // Pull-to-refresh handler.
    const onRefresh = () => {
        fetchFriends({
            auth,
            pageNumber: 1,
            append: false,
            currentFriends: friends,
            setFriends,
            setTotalFriends,
            setCurrentPage,
            setTotalPages,
            setLoading,
            setRefreshing,
            setFilteredFriends: (newFriends) => {
                // No need to manually set filtered friends here
                // The useEffect watching friends will handle it
            },
            refresh: true,
        });
    };

    // Called when end of list is reached.
    const onEndReached = () => {
        if (currentPage < totalPages && !loading) {
            fetchFriends({
                auth,
                pageNumber: currentPage + 1,
                append: true,
                currentFriends: friends,
                setFriends,
                setTotalFriends,
                setCurrentPage,
                setTotalPages,
                setLoading,
                setRefreshing,
                setFilteredFriends: (newFriends) => {
                    // No need to manually set filtered friends here
                    // The useEffect watching friends will handle it
                },
            });
        }
    };

    // Render friend item.
    const renderFriendItem = ({ item }) => (
        <StudentCard
            student={item}
            setfriends={setFriends}
            friends={friends}
            disableBtn={false}
            friendsRequests={[]}
            setfriendsRequests={() => { }}
            sentFriendRequests={[]}
            navigation={navigation}
            setDisableBtn={() => { }}
            setSentFriendRequests={() => { }}
            elevation={false}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity
                    activeOpacity={0.4}
                    style={styles.backBtn} onPress={() => handleBackNavigation(navigation)}>
                    <MaterialIcons name="arrow-back-ios" size={25} color={colors.lightDark} />
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('VertoSearch')}>
                    <MaterialIcons name="search" size={20} color={"gray"} />
                    <Text style={{ color: 'gray', marginRight: 10 }}>Find Friends</Text>
                </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.body}>
                {/* Search bar */}
                <TextInput
                    style={[
                        styles.searchBar,
                        {
                            borderColor: isFocused ? colors.lightDark : 'transparent',
                            backgroundColor: isFocused ? 'white' : colors.btn1,
                        },
                    ]}
                    placeholder={isFocused ? '' : 'Search in name, section, or registration number'}
                    placeholderTextColor="grey"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    value={searchQuery}
                    onChangeText={updateSearchQuery}
                />

                <View style={styles.filterContainer}>
                    {/* Total friends container */}
                    <View style={styles.totalFriendsContainer}>
                        <Text style={styles.text2}>Friends: {totalFriends}</Text>
                    </View>

                    {/* Section filter chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.chipsContainer}
                        contentContainerStyle={styles.chipsContentContainer}
                    >
                        {getUniqueSections().map((sectionData, index) => (
                            <TouchableOpacity
                                activeOpacity={0.5}
                                key={index}
                                style={[
                                    styles.chip,
                                    selectedSection === sectionData.name && styles.chipSelected,
                                ]}
                                onPress={() => filterBySection(sectionData.name)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: selectedSection === sectionData.name ? 'white' : colors.lightDark }
                                    ]}
                                >
                                    {sectionData.name} ({sectionData.count})
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item._id}
                    renderItem={renderFriendItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && currentPage < totalPages ? <TimetableScreenShimmer count={3} /> : null
                    }
                    ListEmptyComponent={
                        !loading && (
                            <EmptyRequests
                                navigation={navigation}
                                btnText="Find Friends"
                                withButton={true}
                                text="You have 0 friends right now"
                                route="VertoSearch"
                            />
                        )
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 15,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        gap: 10,
                        paddingBottom: HEIGHT(10),
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingBottom: HEIGHT(10),
    },
    // header
    header: {
        height: HEIGHT(8),
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    backBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: WIDTH(2),
        marginLeft: 5,
    },
    // Body
    body: {
        height: HEIGHT(92),
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    searchBar: {
        width: '90%',
        height: HEIGHT(6),
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
    },
    filterContainer: {
        width: '100%',
        height: HEIGHT(8),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: WIDTH(5),
    },
    chipsContainer: {
        // width: '100%',
    },
    chipsContentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    chip: {
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT(4),
        paddingHorizontal: WIDTH(4),
        paddingVertical: HEIGHT(0.8),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "grey",
        // backgroundColor: 'white',
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightDark,
    },
    totalFriendsContainer: {
        paddingLeft: 20,
    },
    text2: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.lightDark,
    },
});