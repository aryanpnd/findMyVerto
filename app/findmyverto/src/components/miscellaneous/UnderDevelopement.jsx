import LottieView from "lottie-react-native";
import { Text, View } from "react-native";
import { HEIGHT, WIDTH } from "../../constants/styles";

export default function UnderDevelopement({ feature }) {
    return (
        <View style={{ justifyContent: "center", alignItems: "center",backgroundColor:"white",padding:20 }}>
            <LottieView
                source={require("../../../assets/lotties/development.json")}
                style={{ width: HEIGHT(100), height: WIDTH(100) }}
                autoPlay
                loop />
            <Text style={{ fontSize: 15, color: "grey", fontWeight: "500",textAlign:"center" }}>
                The {feature} feature is currently under development and will be available soon.
            </Text>
            <Text style={{ fontSize: 20, color: "grey", fontWeight: "bold",textAlign:"center" }}>
                Stay tuned for updates 🔔
            </Text>
        </View>
    );
}