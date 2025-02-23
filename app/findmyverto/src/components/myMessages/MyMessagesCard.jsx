import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
    useWindowDimensions,
    Pressable
} from "react-native";
import RenderHTML from "react-native-render-html";
import { globalStyles } from "../../constants/styles";
import { colors } from "../../constants/colors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MyMessagesCard({ message }) {
    const [expanded, setExpanded] = useState(false);
    const { width } = useWindowDimensions();

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const expandOnly = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(true);
    }

    return (
        <Pressable style={styles.messageContainer} onPress={expandOnly}>
            <Text style={styles.messageSubject}>{message.Subject}</Text>
            <View style={styles.descriptionContainer}>
                <RenderHTML
                    contentWidth={width - 20}
                    source={{ html: message.Announcement }}
                    defaultTextProps={{
                        selectable: true,
                        numberOfLines: expanded ? undefined : 3,
                        ellipsizeMode: "tail",
                    }}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.expandButtonText}>{expanded ? "Read Less" : "Read More"}</Text>
                </TouchableOpacity>
                <Text style={styles.messageDate}>{message.AnnouncementDate}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        ...globalStyles.elevationMin
    },
    messageSubject: {
        fontSize: 15,
        fontWeight: "bold",
    },
    descriptionContainer: {
        fontSize: 13,
        marginVertical: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    expandButtonText: {
        color: colors.primary,
        fontSize: 12,
        marginTop: 5,
    },
    messageDate: {
        fontSize: 12,
        fontWeight: "bold",
    },
});
