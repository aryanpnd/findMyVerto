import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function MyMessagesScreen({
    messages,
    pageCount,
    pages,
    currentPage,
    loading,
    refresh,
    isError,
    handleMessagesFetch,
    navigation,
}) {
    // Renders each message item
    const renderMessageItem = ({ item }) => (
        <TouchableOpacity
            style={styles.messageContainer}
        >
            <Text style={styles.messageSubject}>{item.Subject}</Text>
            <Text style={styles.messageDescription}>{item.Announcement}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Loading indicator */}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {/* Error message */}
            {isError && <Text style={styles.errorText}>Error fetching messages.</Text>}

            {/* Message List */}
            {!loading && messages && messages.length > 0 ? (
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) =>
                        item.id ? item.id.toString() : index.toString()
                    }
                    renderItem={renderMessageItem}
                    contentContainerStyle={styles.listContent}
                />
            ) : (!loading && !isError) ? (
                <Text style={styles.noMessagesText}>No messages available.</Text>
            ) : null}

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {/* Pagination Controls */}
                {pageCount > 1 && (
                    <View style={styles.paginationContainer}>
                        {/* Previous Button */}
                        <TouchableOpacity
                            style={[
                                styles.paginationButton,
                                currentPage <= 1 && styles.disabledButton,
                            ]}
                            disabled={currentPage <= 1}
                            onPress={() =>
                                handleMessagesFetch(false, pageCount, currentPage - 1, "", "")
                            }
                        >
                            <Text style={styles.paginationButtonText}>Previous</Text>
                        </TouchableOpacity>

                        {/* Page Number Buttons */}
                        {pages &&
                            pages.map((page, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.paginationButton,
                                        currentPage === page && styles.activeButton,
                                    ]}
                                    onPress={() => {
                                        if (page !== currentPage) {
                                            handleMessagesFetch(false, pageCount, page, "", "");
                                        }
                                    }}
                                >
                                    <Text style={styles.paginationButtonText}>{page}</Text>
                                </TouchableOpacity>
                            ))}

                        {/* Next Button */}
                        <TouchableOpacity
                            style={[
                                styles.paginationButton,
                                currentPage >= pageCount && styles.disabledButton,
                            ]}
                            disabled={currentPage >= pageCount}
                            onPress={() =>
                                handleMessagesFetch(false, pageCount, currentPage + 1, "", "")
                            }
                        >
                            <Text style={styles.paginationButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 16,
    },
    messageContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    messageSubject: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 16,
    },
    noMessagesText: {
        textAlign: 'center',
        marginVertical: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    paginationButton: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    paginationButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    activeButton: {
        backgroundColor: '#005BB5',
    },
});
