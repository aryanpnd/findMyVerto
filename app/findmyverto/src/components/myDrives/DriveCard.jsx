import { View, Text, StyleSheet, Image, Pressable, Linking, Platform, UIManager, LayoutAnimation } from 'react-native';
// import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { globalStyles, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import ButtonV1 from '../miscellaneous/buttons/ButtonV1';

export default function DriveCard({ drive, navigation }) {
    // Enable LayoutAnimation on Android
    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => !prev);
    };

    // const copyDriveCode = async () => {
    //     await Clipboard.setStringAsync(drive.drive_code);
    //     Toast.show({
    //         type: 'success',
    //         text1: 'Copied to Clipboard',
    //         text2: `Drive Code: ${drive.drive_code}`,
    //     });
    // };

    return (
        <Pressable 
            style={[styles.container, { opacity: drive.status === "Open" ? 1 : 0.7 }]}
            onPress={toggleExpand}
        >
            <View style={styles.header}>
                <Text style={[styles.text1, { width: WIDTH(55), color: drive.registered !== "No" && "black" }]}>{drive.company}</Text>
                {
                    (drive.registered === "No" || drive.registered === "Click to Register") ?
                    <Text style={[styles.registeredText, { backgroundColor: "gray" }]}>Not Registered</Text>
                    :
                    <Text style={styles.registeredText}>Registered</Text>
                }
                {
                    drive.registered !== "Yes" &&
                    drive.is_eligible !== "Yes" &&
                    <Text style={[styles.registeredText, { backgroundColor: colors.red }]}>Not Eligible</Text>
                }
            </View>
            <View style={styles.body}>
                {/* Always visible info */}
                <View style={styles.infoContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Image
                            source={require("../../../assets/icons/schedule.png")}
                            style={{ height: 13, width: 13 }}
                            transition={1000}
                        />
                        <Text style={styles.text2}>Drive Date</Text>
                    </View>
                    <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>{drive.drive_date}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Image
                            source={require("../../../assets/icons/clock.png")}
                            style={{ height: 13, width: 13 }}
                            transition={1000}
                        />
                        <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>Register By</Text>
                    </View>
                    <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>{drive.register_by}</Text>
                </View>

                {/* Expandable info */}
                {expanded && (
                    <View>
                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <Feather name="map-pin" size={13} color={colors.orange} />
                                <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>Venue</Text>
                            </View>
                            <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>{drive.venue}</Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <FontAwesome6 name="user-check" size={13} color={"gray"} />
                                <Text style={styles.text2}>Eligible Streams</Text>
                            </View>
                            <Text style={[styles.text2, { maxWidth: WIDTH(50) }]}>{drive.streams_eligible}</Text>
                        </View>

                        {/* Click to Copy Drive Code */}
                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <MaterialIcons name="file-copy" size={13} color="gray" />
                                <Text style={styles.text2}>Drive Code</Text>
                            </View>
                            <Pressable>
                                <Text selectable={true} style={[styles.text2, { maxWidth: WIDTH(50) }]}>
                                    {drive.drive_code}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                {
                    drive.status === "Open" ?
                        <Text style={[styles.registeredText, { backgroundColor: colors.green }]}>Open</Text>
                        :
                        <Text style={[styles.registeredText, { backgroundColor: "gray" }]}>Closed</Text>
                }

                <ButtonV1 
                    childrenStyle={{flexDirection:"row",justifyContent: 'center', alignItems: 'center'}}
                    style={styles.viewDetailsBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(drive.job_profile);
                    }}
                >
                    <MaterialCommunityIcons name="information-outline" size={13} color="white" />
                    <Text style={{ color: "white", fontSize: 13 }}>View Details</Text>
                </ButtonV1>
            </View>
            
            {/* <Text style={styles.toggleText}>
                {expanded ? "Click to hide" : "Click to expand"}
            </Text> */}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        // width: WIDTH(95),
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        ...globalStyles.elevationMin
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    registeredText: {
        maxWidth: WIDTH(30),
        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: colors.green,
        color: "white"
    },
    body: {
        marginTop: 10
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 5
    },
    viewDetailsBtn: {
        backgroundColor: "black",
        padding: 8,
        borderRadius: 15,
        width: WIDTH(40),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        gap: 5
    },
    text1: {
        color: "grey",
        fontSize: 15,
        fontWeight: 'bold'
    },
    text2: {
        fontSize: 13,
        color: "grey",
    },
    toggleText: {
        color: 'gray',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 5
    },
});