import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';


const TabItem = ({ isFocused, onPress, onLongPress, label, iconNameActive, iconNameInactive }) => {
    const containerStyle = {
        backgroundColor: isFocused ? 'rgba(255,255,255,0.3)' : 'transparent',
        borderRadius: 15,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', padding: 10 }}
        >
            <View style={containerStyle}>
                <Ionicons
                    name={isFocused ? iconNameActive : iconNameInactive}
                    size={24}
                    color={isFocused ? 'white' : 'grey'}
                />
                {isFocused && <Text style={{ color: 'white', marginTop: 4 }}>{label}</Text>}
            </View>
        </Pressable>
    );
};

export const TabBar = ({ state, descriptors, navigation }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: colors.primary,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
            }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Default icons for demonstration. Adjust per route if needed.
                const iconNameActive = 'home';
                const iconNameInactive = 'home-outline';

                return (
                    <TabItem
                        key={index}
                        isFocused={isFocused}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        label={label}
                        iconNameActive={iconNameActive}
                        iconNameInactive={iconNameInactive}
                    />
                );
            })}
        </View>
    );
};