import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles";
import { AppContext } from "../../../context/MainApp";
import { useContext, useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAllowedFieldsToShow, handleSetAllowedFieldsToShow } from "../../../utils/fetchUtils/handleUser/fetchSettings";
import { AuthContext } from "../../../context/Auth";
import { availableFieldsToShow } from "../../constants/globalConstants";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function AllowedFieldsToShow() {
    const { auth } = useContext(AuthContext);
    const { allowedFieldsToShow, setAllowedFieldsToShow } = useContext(AppContext);
    const [updatedFields, setUpdatedFields] = useState([...allowedFieldsToShow]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [update, setUpdate] = useState(false);

    async function handleGetFields() {
        getAllowedFieldsToShow(auth, setAllowedFieldsToShow, setUpdatedFields, setRefreshing);
    }

    async function handleUpdateFields() {
        console.log(updatedFields);

        await handleSetAllowedFieldsToShow(auth, updatedFields, setAllowedFieldsToShow, setLoading);
        setUpdate(false);
    }

    useEffect(() => {
        if (update) handleGetFields();
    }, [update]);

    function toggleFieldSelection(field) {
        setUpdatedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(item => item !== field)
                : [...prevFields, field]
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                transparent
                statusBarTranslucent={true}
                animationType="fade"
                visible={update}
                onRequestClose={() => setUpdate(false)}
            >
                <View style={styles.overlay}>
                    <View style={[styles.alertBox, globalStyles.elevation]}>
                        <Text style={styles.text1}>Details visibility</Text>
                        <Text style={{ fontSize: 12, color: "grey" }}>Set allowed Details to Show to your Friends</Text>
                        <ScrollView style={{ maxHeight: HEIGHT(40), paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                            {refreshing ?
                                Array.from({ length: 10 }).map((_, index) => (
                                    <View style={{marginVertical: 5}} key={index}>
                                    <ShimmerPlaceHolder visible={false} style={{ borderRadius: 10 }} height={HEIGHT(3)} width={WIDTH(60)} />
                                    </View>
                                ))
                                : (
                                    Object.keys(availableFieldsToShow).map((field, index) => (
                                        <TouchableOpacity key={index} style={styles.fields} onPress={() => toggleFieldSelection(field)}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                <Image source={availableFieldsToShow[field].icon} style={{ width: 20, height: 20,objectFit:"fill" }} />
                                                <Text>{availableFieldsToShow[field].title}</Text>
                                            </View>
                                            {updatedFields.includes(field) &&
                                                <FontAwesome5 name="check" size={14} color="black" />
                                            }
                                        </TouchableOpacity>
                                    ))
                                )
                            }
                        </ScrollView>
                        <View style={{ alignSelf: "baseline", gap: 10, width: WIDTH(60) }}>
                            <TouchableOpacity style={styles.button} onPress={() => setUpdate(false)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <Pressable
                                style={[styles.button, { backgroundColor: "black" }]}
                                onPress={handleUpdateFields}
                            >
                                {loading ?
                                    <ActivityIndicator size="small" color="white" />
                                    :
                                    <Text style={{ color: "white" }}>Save</Text>}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Pressable style={styles.card} onPress={() => setUpdate(true)}>
                <Text style={styles.text1}>Details visibility</Text>
                <View style={styles.editButton} >
                    <FontAwesome5 name="edit" size={20} color={colors.lightDark} />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginTop: HEIGHT(2),
        gap: 20,
        padding: WIDTH(5),
        borderRadius: 10,
        backgroundColor: colors.whiteLight
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
        borderRadius: 10
    },
    card: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    fields: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10
    },
    text1: {
        fontSize: 15,
        fontWeight: "500",
        color: "grey",
    },
    editButton: {
        paddingHorizontal: 10,
        borderRadius: 10
    },
    button: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
