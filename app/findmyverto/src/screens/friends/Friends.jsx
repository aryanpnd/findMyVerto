import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    FlatList,
    RefreshControl,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { AuthContext } from '../../../context/Auth';
import SearchedStudentCard from '../../components/vertoSearch/SearchedStudentCard';
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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
                    setFilteredFriends(parsedFriends);
                }
            } catch (error) {
                console.error("Error reading local storage", error);
            }
            // Then fetch from API to update the list.
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
                setFilteredFriends,
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
                setFilteredFriends,
            });
            setFriendsRefreshing(false);
        }
    }, [friendsRefreshing]);

    // Search filter logic.
    const updateSearchQuery = (text) => {
        setSearchQuery(text);
        const lowerCaseQuery = text.toLowerCase();
        if (text === '') {
            setFilteredFriends(friends);
        } else {
            const filtered = friends.filter((friend) => {
                return (
                    friend.name.toLowerCase().includes(lowerCaseQuery) ||
                    friend.reg_no.toLowerCase().includes(lowerCaseQuery) ||
                    friend.section.toLowerCase().includes(lowerCaseQuery)
                );
            });
            setFilteredFriends(filtered);
        }
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
            setFilteredFriends,
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
                setFilteredFriends,
            });
        }
    };

    // Render friend item.
    const renderFriendItem = ({ item }) => (
        <SearchedStudentCard
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
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => handleBackNavigation(navigation)}>
                    <MaterialIcons name="arrow-back-ios" size={25} color={colors.lightDark} />
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('VertoSearch')}>
                    <Text style={{ color: 'gray', marginRight: 10 }}>Search Friends</Text>
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

                {/* Total friends container */}
                <View style={styles.totalFriendsContainer}>
                    <Text style={styles.text2}>Friends: {totalFriends}</Text>
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
                        gap:10,
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
    totalFriendsContainer: {
        width: '90%',
        height: HEIGHT(8),
        justifyContent: 'center',
    },
    text2: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.lightDark,
    },
});
