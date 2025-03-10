import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '../../constants/colors';

const NotificationPermissionSheet = forwardRef((props, ref) => {
    const bottomSheetModalRef = useRef(null);
    const [data, setData] = useState({
        title: '',
        message: '',
        onAllow: () => { },
        onDontAskAgain: () => { },
    });

    // Expose open and close methods via the ref
    useImperativeHandle(ref, () => ({
        open: (title, message, onAllow, onDontAskAgain) => {
            setData({ title, message, onAllow, onDontAskAgain });
            bottomSheetModalRef.current?.present();
        },
        close: () => {
            bottomSheetModalRef.current?.dismiss();
        },
    }));

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['45%']}
            enablePanDownToClose={false}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} pressBehavior="none" opacity={0.4} disappearsOnIndex={-1} />
            )}
        >
            <BottomSheetView style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        style={[styles.dontAskButton]}
                        onPress={() => {
                            if (data.onDontAskAgain) data.onDontAskAgain();
                            bottomSheetModalRef.current?.dismiss();
                        }}
                    >
                        <Text style={styles.cancelText}>Don't Ask Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.cancelButton]}
                        onPress={async () => {
                            bottomSheetModalRef.current?.dismiss();
                        }}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <Image
                    source={require('../../../assets/icons/bell.png')}
                    style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 10 }} />
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.message}>{data.message}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.allowButton, { paddingVertical: 15 }]}
                        onPress={async () => {
                            if (data.onAllow) await data.onAllow();
                            bottomSheetModalRef.current?.dismiss();
                        }}
                    >
                        <Text style={styles.buttonText}>Allow</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        gap: 10,
    },
    button: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    allowButton: {
        backgroundColor: colors.primary,
    },
    cancelButton: {
    },
    dontAskButton: {
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelText: {
        fontSize: 16,
        color: 'grey',
        fontWeight: 'bold',
    },
});

export default NotificationPermissionSheet;
