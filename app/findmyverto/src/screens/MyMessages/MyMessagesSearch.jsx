import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    Keyboard,
} from 'react-native';
import { AuthContext } from '../../../context/Auth';
import MyMessagesCard from '../../components/myMessages/MyMessagesCard';
import Toast from 'react-native-toast-message';
import { globalStyles, HEIGHT, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import { searchMyMessages } from '../../../utils/fetchUtils/userData/myMessagesFetch';
import LottieView from 'lottie-react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function MyMessagesSearch({ navigation }) {
    const { auth } = useContext(AuthContext);

    const [messages, setMessages] = useState({});
    const [pageCount, setPageCount] = useState(0);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    const [lastQuery, setLastQuery] = useState({ subject: "", description: "" });

    const [update, setUpdate] = useState(false);

    const handleSearch = async (pageNumber = 1) => {
        if (
            subject.trim().toLowerCase() !== lastQuery.subject.trim().toLowerCase() ||
            description.trim().toLowerCase() !== lastQuery.description.trim().toLowerCase()
        ) {
            setMessages({});
            setPageCount(0);
            setPages([]);
            setCurrentPage(0);
            setLastSynced("");
            setLastQuery({ subject, description });
        }
        await searchMyMessages(
            auth,
            pageCount,
            pageNumber,
            subject,
            description,
            messages,
            setMessages,
            setPageCount,
            setPages,
            setCurrentPage,
            setLastSynced,
            setLoading,
            setIsError
        );
        Keyboard.dismiss();
    };
    const noDataFound =
        messages[currentPage] &&
        messages[currentPage].data &&
        messages[currentPage].data[0]?.Subject === "No Record Found";

    const renderMessageItem = ({ item }) => <MyMessagesCard message={item} />;

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Subject"
                    placeholderTextColor="grey"
                    value={subject}
                    onChangeText={setSubject}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Description"
                    placeholderTextColor="grey"
                    value={description}
                    onChangeText={setDescription}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(1)}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                {noDataFound ? (
                    <Text style={styles.headerText}>No messages found from you query</Text>
                ) : (
                    <>
                        <Text style={styles.headerText}>
                            Messages: {messages[currentPage] ? messages[currentPage].data.length : 0}
                        </Text>
                        <TouchableOpacity style={styles.pageButton} onPress={() => setUpdate(true)}>
                            <Text style={[styles.headerText, { color: 'black' }]}>Page: {currentPage}</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>
                            Total:{' '}
                            {messages[currentPage] && messages[currentPage].data[0]
                                ? messages[currentPage].data[0].TotalMessages
                                : 0}
                        </Text>
                    </>
                )}
            </View>

            {loading ? (
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
            ) : isError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error fetching messages.</Text>
                    <TouchableOpacity onPress={() => handleSearch(1)} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : noDataFound ? (
                <View style={{ alignItems: "center" }}>
                    <LottieView
                        source={require("../../../assets/lotties/empty.json")}
                        autoPlay
                        loop
                        style={{ height: HEIGHT(50), width: WIDTH(80), alignSelf: "center" }}
                    />
                    <Text style={[styles.text1, { color: "grey" }]}>No messages found</Text>

                </View>
            ) : (
                <FlatList
                    data={messages[currentPage] ? messages[currentPage].data : []}
                    keyExtractor={(item, index) =>
                        item.id ? item.id.toString() : index.toString()
                    }
                    renderItem={renderMessageItem}
                    contentContainerStyle={{
                        paddingBottom: HEIGHT(5),
                        paddingHorizontal: WIDTH(2),
                    }}
                />
            )}

            {!noDataFound && pages.length > 0 && (
                <Modal
                    transparent
                    statusBarTranslucent={true}
                    animationType="fade"
                    visible={update}
                    onRequestClose={() => setUpdate(false)}
                >
                    <View style={styles.overlay}>
                        <View style={[styles.alertBox, globalStyles.elevation]}>
                            <Text style={[styles.headerText, { color: colors.lightDark }]}>All Pages</Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>
                                Click to navigate to the message page
                            </Text>
                            <ScrollView
                                style={{ maxHeight: HEIGHT(40), paddingTop: 10 }}
                                contentContainerStyle={styles.pageNavButtonContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                {pages.map((page, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.pageNavButton,
                                            { backgroundColor: currentPage === page ? 'black' : 'white' },
                                        ]}
                                        onPress={() => {
                                            handleSearch(page);
                                            setUpdate(false);
                                        }}
                                    >
                                        <Text style={{ color: currentPage === page ? 'white' : 'black' }}>
                                            {page}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={{ alignSelf: 'baseline', gap: 10, width: '100%', justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setUpdate(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchContainer: {
        padding: 10,
        backgroundColor: colors.secondary,
    },
    searchInput: {
        height: HEIGHT(6),
        borderWidth: 1,
        borderColor: colors.disabledBackground,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 10,
        color: 'black',
        backgroundColor: 'white',
    },
    searchButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
        ...globalStyles.elevationMin,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: HEIGHT(2),
        backgroundColor: colors.secondary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: colors.whitePrimary,
        fontWeight: '500',
        fontSize: 15,
    },
    pageButton: {
        backgroundColor: 'white',
        padding: WIDTH(2),
        borderRadius: 10,
        ...globalStyles.elevation,
    },
    errorContainer: {
        alignItems: 'center',
        marginTop: HEIGHT(2),
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: HEIGHT(5),
    },
    emptyText: {
        fontSize: 18,
        color: 'grey',
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
        gap: 10,
    },
    pageNavButton: {
        width: '20%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 1,
    },
    modalCancelButton: {
        width: WIDTH(70),
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
