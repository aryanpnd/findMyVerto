import { Text, View } from "react-native";
import UnderDevelopement from "../../components/miscellaneous/UnderDevelopement";

export default function Feed() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Comming Soon!
            </Text>
            <UnderDevelopement feature={"Feeds"} />
        </View>
    )
}