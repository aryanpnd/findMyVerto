import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export const CustomBackButton = ({color}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Entypo name="chevron-up" size={24} color={color} />
        </TouchableOpacity>
    );
};