import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import MyMessagesCard from './MyMessagesCard';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import SyncData from '../miscellaneous/SyncData';
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter';
import { colors } from '../../constants/colors';
import Toast from 'react-native-toast-message';
import { globalStyles, HEIGHT, WIDTH } from '../../constants/styles';
import { ErrorMessage } from '../timeTable/ErrorMessage';
import LottieView from 'lottie-react-native';
import { userStorage } from '../../../utils/storage/storage';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function MyMessagesScreen({
    messages,
    setMessages,
    pageCount,
    pages,
    currentPage,
    loading,
    refresh,
    lastSynced,
    isError,
    handleMessagesFetch,
    navigation,
}) {
    const [messagesTemp, setMessagesTemp] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setFocused] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setMessagesTemp(messages);
    }, [messages]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setMessagesTemp(messages);
        } else {
            const filteredMessages = messages.filter((message) => {
                return message.Subject.toLowerCase().includes(searchQuery.toLowerCase()) || message.Announcement.toLowerCase().includes(searchQuery.toLowerCase());
            });
            setMessagesTemp(filteredMessages);
        }
    }, [searchQuery]);

    const searchQueryHandler = (text) => {
        setSearchQuery(text);
    };

    const renderMessageItem = ({ item }) => (
        <MyMessagesCard message={item} />
    );

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ zIndex: 2 }}>
                <Toast />
                <SyncData
                    time={loading ? "Loading..." : formatTimeAgo(lastSynced)}
                    syncNow={() => handleMessagesFetch(true, 0, 0, "", "")}
                    dataLoading={loading}
                    self={!loading}
                    color={"white"} bg={colors.secondary}
                    loader={true} loading={refresh} />
            </View>

            {!isError && messages?.length > 0 && <View style={styles.header}>
                {
                    loading ?
                        <ShimmerPlaceHolder style={{
                            height: HEIGHT(5),
                            width: WIDTH(90),
                            borderRadius: 10
                        }} visible={false} />
                        :
                        <View style={styles.headerSection}>
                            <Text style={[styles.text1, { color: colors.whitePrimary }]}>Messages: {messages?.length}</Text>
                            <TouchableOpacity style={styles.pageButton} onPress={() => setUpdate(true)}>
                                <Text style={[styles.text1, { color: "black" }]}>Page: {currentPage}</Text>
                            </TouchableOpacity>
                            <Text style={[styles.text1, { color: colors.whitePrimary }]}>Total: {messages[0]?.TotalMessages}</Text>
                        </View>
                }
            </View>}

            {
                isError ?
                    <ErrorMessage handleFetchTimetable={() => handleMessagesFetch(false, pageCount, pageNumber, "", "")} timetableLoading={loading} buttonHeight={45} ErrorMessage={"Messages"} />
                    :
                    loading ?
                    <View style={{ flex: 1, alignItems: "center", marginTop: HEIGHT(1), gap: HEIGHT(1) }}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <ShimmerPlaceHolder key={index} style={[{
                                    height: HEIGHT(20),
                                    width: WIDTH(95),
                                    borderRadius: 20,
                                    marginVertical: HEIGHT(1),
                                }]} visible={false} />
                            ))}
                        </View>
                        :
                        messages?.length > 0 ?
                            <View style={{ flex: 1, alignItems: "center", marginTop: HEIGHT(1), gap: HEIGHT(1) }}>
                                <SearchBar searchQuery={searchQuery} updateSearchQuery={searchQueryHandler} isFocused={isFocused} setFocused={setFocused} />
                                <FlatList
                                    // style={styles.body}
                                    data={messagesTemp}
                                    keyExtractor={(item, index) =>
                                        item.id ? item.id.toString() : index.toString()
                                    }
                                    renderItem={renderMessageItem}
                                    contentContainerStyle={{ paddingHorizontal: WIDTH(1), justifyContent: "center", paddingBottom: HEIGHT(5) }}
                                />
                            </View>
                            :
                            <View style={[styles.body]} >
                                <LottieView
                                    source={require("../../../assets/lotties/empty.json")}
                                    autoPlay
                                    loop
                                    style={{ height: HEIGHT(50), width: WIDTH(80), alignSelf: "center" }}
                                />
                                <Text style={[styles.text1, { color: "grey" }]}>No messages found</Text>

                            </View>
            }


            {/* modal */}
            <Modal
                transparent
                statusBarTranslucent={true}
                animationType="fade"
                visible={update}
                onRequestClose={() => setUpdate(false)}
            >
                <View style={styles.overlay}>
                    <View style={[styles.alertBox, globalStyles.elevation]}>
                        <Text style={[styles.text1, { color: colors.lightDark }]}>All Pages</Text>
                        <Text style={{ fontSize: 12, color: "grey" }}>Click to navigate to the message page</Text>
                        <ScrollView
                            style={{ maxHeight: HEIGHT(40), paddingTop: 10 }}
                            contentContainerStyle={styles.pageNavButtonContainer}
                            showsVerticalScrollIndicator={false}>
                            {
                                pages &&
                                pages.map((page, index) => (
                                    <TouchableOpacity key={index}
                                        style={[styles.pageNavButton, { backgroundColor: currentPage === page ? "black" : "white" }]}
                                        onPress={() => {
                                            handleMessagesFetch(false, pageCount, page, "", "")
                                            }}>
                                        <Text style={{ color: currentPage === page ? "white" : "black" }}>{page}</Text>
                                    </TouchableOpacity>
                                ))

                            }
                        </ScrollView>
                        <View style={{ alignSelf: "baseline", gap: 10, width: "100%", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setUpdate(false)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function SearchBar({ searchQuery, updateSearchQuery, isFocused, setFocused }) {
    return (
        <TextInput
            style={[styles.searchBar, {
                borderColor: isFocused ? colors.lightDark : colors.disabledBackground,
                backgroundColor: isFocused ? "white" : "transparent",
            }]}
            placeholder={isFocused ? "" : 'Search for a message'}
            placeholderTextColor={"grey"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={searchQuery}
            onChangeText={updateSearchQuery}
        />
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: WIDTH(5),
        paddingVertical: HEIGHT(2),
        backgroundColor: colors.secondary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    pageButton: {
        backgroundColor: "white",
        padding: WIDTH(2),
        borderRadius: 10,
        ...globalStyles.elevation
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        maxWidth: WIDTH(80),
        paddingHorizontal: WIDTH(5),
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNavButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginLeft: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        gap: 10
    },
    pageNavButton: {
        width: '20%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 1
    },
    modalCancelButton: {
        width: WIDTH(70),
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    body: {
        paddingHorizontal: WIDTH(1),
        justifyContent: "center",
        alignItems: "center",
    },

    searchBar: {
        width: WIDTH(95),
        height: HEIGHT(6),
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15
    },

    text1: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.whitePrimary,
    },
    text2: {
        // fontSize: 14,
        fontWeight: "500",
        color: colors.whitePrimary,
    }
});
