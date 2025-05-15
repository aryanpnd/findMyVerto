import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const SortBottomSheet = forwardRef(({ sortMethod, onSortMethodChange }, ref) => {
    const bottomSheetModalRef = useRef(null);

    // Expose open and close methods via the ref
    useImperativeHandle(ref, () => ({
        open: () => {
            bottomSheetModalRef.current?.present();
        },
        close: () => {
            bottomSheetModalRef.current?.dismiss();
        },
    }));

    const handleSortMethod = (method) => {
        onSortMethodChange(method);
        bottomSheetModalRef.current?.dismiss();
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['30%']}
            enablePanDownToClose={true}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.4} disappearsOnIndex={-1} />
            )}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sort Attendance By</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.sortOption,
                        sortMethod === 'none' && styles.selectedOption
                    ]}
                    onPress={() => handleSortMethod('none')}
                >
                    <View style={styles.textContainer}>
                        <MaterialCommunityIcons name='sort-reverse-variant' size={18} color="black" />
                        <Text style={styles.sortOptionText}>Default</Text>
                    </View>
                    {sortMethod === 'none' && (
                        <FontAwesome5 name="check" size={14} color="black" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.sortOption,
                        sortMethod === 'ascending' && styles.selectedOption
                    ]}
                    onPress={() => handleSortMethod('ascending')}
                >
                    <View style={styles.textContainer}>
                        <MaterialCommunityIcons name='sort-ascending' size={18} color="black" />
                        <Text style={styles.sortOptionText}>Lowest to Highest</Text>
                    </View>
                    {sortMethod === 'ascending' && (
                        <FontAwesome5 name="check" size={14} color="black" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.sortOption,
                        sortMethod === 'descending' && styles.selectedOption
                    ]}
                    onPress={() => handleSortMethod('descending')}
                >
                    <View style={styles.textContainer}>
                        <MaterialCommunityIcons name='sort-descending' size={18} color="black" />
                        <Text style={styles.sortOptionText}>Highest to Lowest</Text>
                    </View>
                    {sortMethod === 'descending' && (
                        <FontAwesome5 name="check" size={14} color="black" />
                    )}
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.lightDark,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        // borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedOption: {
        // backgroundColor: '#f0f8ff',
    },
    sortOptionText: {
        fontSize: 15,
        color: "grey",
        fontWeight: '500',
    },
});

export default SortBottomSheet;