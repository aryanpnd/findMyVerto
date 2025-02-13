import { Ionicons } from "@expo/vector-icons"
import { Image, Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"

export default function ImageViewer({ image, visible, setVisible }) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide" statusBarTranslucent={true}>
            <View style={styles.modalOverlay}>
                <Text style={{color:"white"}}>Swipe or touch anywhere to close</Text>
                <Pressable style={styles.modalBackground} onPress={() => setVisible(false)} />
                <Pressable style={styles.imageWrapper} onPress={() => setVisible(false)}>
                    <Image
                        source={image}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBackground: {
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "70%"
    },
    fullscreenImage: {
        width: "100%",
        height: "100%"
    }
})