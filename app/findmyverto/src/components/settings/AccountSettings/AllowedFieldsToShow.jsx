import React, { useState, useEffect, useImperativeHandle, forwardRef, useContext } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { globalStyles, HEIGHT, WIDTH } from "../../../constants/styles";
import { colors } from "../../../constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { availableFieldsToShow } from "../../../constants/globalConstants";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { getAllowedFieldsToShow, handleSetAllowedFieldsToShow } from "../../../../utils/fetchUtils/handleUser/fetchSettings";
import { AuthContext } from "../../../../context/Auth";
import { AppContext } from "../../../../context/MainApp";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const AllowedFieldsToShow = forwardRef((props, ref) => {
    const { auth } = useContext(AuthContext);
    const { allowedFieldsToShow, setAllowedFieldsToShow } = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [updatedFields, setUpdatedFields] = useState([...allowedFieldsToShow]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Expose modal controls to parent components
    useImperativeHandle(ref, () => ({
        open: () => {
            setModalVisible(true);
            fetchFields();
        },
        close: () => setModalVisible(false),
    }));

    // Fetch the allowed fields when modal opens
    const fetchFields = async () => {
        setRefreshing(true);
        await getAllowedFieldsToShow(auth, setAllowedFieldsToShow, setUpdatedFields, setRefreshing);
        setRefreshing(false);
    };

    // Update the allowed fields
    const handleUpdateFields = async () => {
        setLoading(true);
        await handleSetAllowedFieldsToShow(auth, updatedFields, setAllowedFieldsToShow, setLoading);
        setLoading(false);
        setModalVisible(false);
    };

    const toggleFieldSelection = (field) => {
        setUpdatedFields((prevFields) =>
            prevFields.includes(field)
                ? prevFields.filter((item) => item !== field)
                : [...prevFields, field]
        );
    };

    return (
        <Modal
            transparent
            statusBarTranslucent
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={[styles.alertBox, globalStyles.elevation]}>
                    <Text style={styles.title}>Details visibility</Text>
                    <Text style={styles.subtitle}>Set allowed Details to Show to your Friends</Text>
                    <ScrollView style={{ maxHeight: HEIGHT(40), paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                        {refreshing
                            ? Array.from({ length: 10 }).map((_, index) => (
                                <View style={{ marginVertical: 5 }} key={index}>
                                    <ShimmerPlaceHolder
                                        visible={false}
                                        style={{ borderRadius: 10 }}
                                        height={HEIGHT(3)}
                                        width={WIDTH(60)}
                                    />
                                </View>
                            ))
                            : Object.keys(availableFieldsToShow).map((field, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.fieldRow}
                                    onPress={() => toggleFieldSelection(field)}
                                >
                                    <View style={styles.fieldInfo}>
                                        <Image source={availableFieldsToShow[field].icon} style={styles.icon} />
                                        <Text>{availableFieldsToShow[field].title}</Text>
                                    </View>
                                    {updatedFields.includes(field) && (
                                        <FontAwesome5 name="check" size={14} color="black" />
                                    )}
                                </TouchableOpacity>
                            ))}
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <Pressable style={[styles.button, { backgroundColor: "black" }]} onPress={handleUpdateFields}>
                            {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={{ color: "white" }}>Save</Text>}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

export default AllowedFieldsToShow;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertBox: {
        maxWidth: WIDTH(80),
        paddingHorizontal: WIDTH(5),
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: "500",
        color: "grey",
    },
    subtitle: {
        fontSize: 12,
        color: "grey",
    },
    fieldRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    fieldInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    icon: {
        width: 20,
        height: 20,
        // Note: React Native does not have a direct "objectFit" property.
        resizeMode: "contain",
    },
    buttonContainer: {
        alignSelf: "baseline",
        gap: 10,
        width: WIDTH(60),
    },
    button: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
