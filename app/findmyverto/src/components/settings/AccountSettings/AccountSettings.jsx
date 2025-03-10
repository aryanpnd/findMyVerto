import { useRef } from "react";
import { View } from "react-native";
import { CustomButton } from "../CustomButton";
import AllowedFieldsToShow from "./AllowedFieldsToShow";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";

export default function AccountSettings() {
    const modalRef = useRef();
    return (
        <View>
            <CustomButton
                icon={<FontAwesome5 name="edit" size={15} color={colors.lightDark} />}
                title="Details visible to friends" onPress={() => modalRef.current.open()} />
            <AllowedFieldsToShow ref={modalRef} />
        </View>
    )
}