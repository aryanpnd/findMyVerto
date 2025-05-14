import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions, Image, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import StudentCard from '../../components/vertoSearch/StudentCard';
import { loadStudents } from '../../../utils/fetchUtils/handleUser/searchStudents';
import { AuthContext } from '../../../context/Auth';
import { HEIGHT, WIDTH } from '../../constants/styles';

const { height, width } = Dimensions.get('window');

export default function VertoSearch({ navigation }) {
    const { auth } = useContext(AuthContext);
    const [query, setQuery] = useState("");
    const [searchedQuery, setSearchedQuery] = useState("");
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [isFocused, setFocused] = useState(false);
    const [students, setStudents] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);

    const limit = 20; // items per page

    const handleSearchStudents = async () => {
        if (query.length < 2) {
            Toast.show({
                type: 'error',
                text1: 'Search query must be greater than 2',
            });
            return;
        }
        setSearchedQuery(query); // Save the query for later use in no results found container
        Keyboard.dismiss();
        setSearchInitiated(true);
        setPage(1);
        setLoading(true);
        try {
            const result = await loadStudents(auth, query, 1, limit);
            if (result.success) {
                setStudents(result.students);
                setFriends(result.friends);
                setFriendRequests(result.friendRequests);
                setSentFriendRequests(result.sentFriendRequests);
                setTotalPages(result.totalPages);
                setPage(result.currentPage);
                setTotalStudents(result.totalStudents);
            } else {
                setStudents([]);
                setFriends([]);
                setFriendRequests([]);
                setSentFriendRequests([]);
                Toast.show({
                    type: 'error',
                    text1: result.message || 'No student found',
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error while searching',
                text2: err.message,
            });
            console.log(err);
        }
        setLoading(false);
    };

    const handleLoadMore = async () => {
        if (!loading && !loadingMore && page < totalPages) {
            setLoadingMore(true);
            try {
                const nextPage = page + 1;
                const result = await loadStudents(auth, query, nextPage, limit);
                if (result.success) {
                    setStudents((prev) => [...prev, ...result.students]);
                    setPage(result.currentPage);
                }
            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error loading more',
                    text2: err.message,
                });
                console.log(err);
            }
            setLoadingMore(false);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <LottieView
                    autoPlay
                    style={{
                        width: 100,
                        height: 100,
                    }}
                    source={require('../../../assets/lotties/loading4.json')}
                />

            </View>
        );
    };

    const renderItem = ({ item, index }) => {
        // Skip the logged-in user's card
        if (item.reg_no === auth.reg_no) return null;
        return (
            <StudentCard
                key={index}
                student={item}
                friends={friends}
                setfriends={setFriends}
                friendsRequests={friendRequests}
                setfriendsRequests={setFriendRequests}
                sentFriendRequests={sentFriendRequests}
                setSentFriendRequests={setSentFriendRequests}
                navigation={navigation}
                disableBtn={false}
                setDisableBtn={() => { }}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>
            <View style={{ zIndex: 2 }}>
                <Toast />
            </View>
            <View style={styles.header}>
                {/* Back navigation button */}
                <View style={styles.backBtn}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={25} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
                {/* Search input */}
                <TextInput
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                    style={[
                        styles.searchBar,
                        {
                            width: isFocused && query.length > 2 ? "80%" : "90%",
                            borderColor: isFocused ? "grey" : 'transparent',
                            backgroundColor: isFocused ? "white" : colors.btn1,
                        },
                    ]}
                    placeholder={isFocused ? "" : 'Search in name, section, or registration number '}
                    placeholderTextColor="grey"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onSubmitEditing={handleSearchStudents}
                    clearButtonMode="while-editing"
                />
                {/* Search button */}
                <View style={[styles.backBtn, { display: isFocused && query.length > 2 ? "flex" : "none" }]}>
                    <TouchableOpacity onPress={handleSearchStudents}>
                        <FontAwesome5 name="arrow-right" size={20} color={colors.lightDark} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                {searchInitiated && !loading && (
                    <View style={styles.studentsFoundContainer}>
                        <Text style={styles.text2}>Students found</Text>
                        <Text style={styles.text2}>{totalStudents}</Text>
                    </View>
                )}
                {searchInitiated ? (
                    loading ? (
                        // Loading animation
                        <View style={{ height: height * 0.7, justifyContent: "center" }}>
                            <LottieView
                                autoPlay
                                style={{
                                    width: width,
                                    height: width,
                                    opacity: 0.8,
                                }}
                                source={require('../../../assets/lotties/searchAnim.json')}
                            />
                            <Text style={styles.text1}>Looking for them...</Text>
                        </View>
                    ) : students.length < 1 ? (
                        // No results found container
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View
                                style={{ height: HEIGHT(70), alignItems: "center", justifyContent: "center", gap: 20 }}>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: WIDTH(100),
                                        height: HEIGHT(20),
                                        opacity: 0.8,
                                    }}
                                    source={require('../../../assets/lotties/notfound.json')}
                                />
                                <Text style={styles.text2}>No student found matching your query: {searchedQuery}</Text>
                                <Text style={styles.text1}>Please check your query again</Text>
                                <Text style={styles.text1}>or</Text>
                                <Text style={styles.text1}>They might not be registered on this app yet</Text>
                            </View>
                        </ScrollView>
                    ) : (
                        // FlatList for paginated results
                        <FlatList
                            data={students}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                alignItems: "center",
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                gap: 5
                            }}
                        />
                    )
                ) : (
                    // Initial search vector image
                    <View style={{ alignItems: "center", height: height * 0.8, justifyContent: "center", gap: 20 }}>
                        <Image
                            source={require("../../../assets/illustrations/search.png")}
                            style={{ height: width * 0.7, width: width * 0.9, opacity: 0.8 }}
                            transition={1000}
                        />
                        <Text style={styles.text1}>Search in Student's name, Section, or registration number</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header: {
        height: 0.08 * height,
        width: '100%',
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
    },
    backBtn: {
        width: "10%",
        justifyContent: "center",
        alignItems: 'center',
    },
    searchBar: {
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
    },
    body: {
        height: "92%",
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    studentsFoundContainer: {
        width: "100%",
        paddingHorizontal: 20,
        height: height * 0.05,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    text1: { fontSize: 12, textAlign: "center", color: "grey" },
    text2: { fontSize: 15, fontWeight: "500", color: colors.lightDark },
});
