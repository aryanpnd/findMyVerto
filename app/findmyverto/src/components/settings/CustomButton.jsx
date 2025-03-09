import { Text, StyleSheet, Pressable, Platform, TouchableOpacity, View } from 'react-native';

export const CustomButton = ({ title, title2, icon, onPress }) => {
    const content = <Text style={styles.itemText}>{title}</Text>;
    const content2 = <Text style={styles.itemText2}>{title2}</Text>;

    if (Platform.OS === 'android') {
        return (
            <Pressable style={styles.item} android_ripple={{ color: '#ccc' }} onPress={() => onPress()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {icon && icon}
                    {content}
                </View>
                {title2 && content2}
            </Pressable>
        );
    } else {
        return (
            <TouchableOpacity style={styles.item} onPress={() => onPress()}>
                {content}
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    item: {
        padding: 12,
        paddingHorizontal: 30,
        // marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 15,
    },
    itemText2: {
        fontSize: 13,
        color: 'grey',
    },
});