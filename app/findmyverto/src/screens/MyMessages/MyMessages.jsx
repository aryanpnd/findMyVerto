import { View } from "react-native";
import UnderDevelopement from "../../components/miscellaneous/UnderDevelopement";

export default function MyMessages() {
    return (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
            <UnderDevelopement feature={"My Messages"} />
        </View>
    )
}