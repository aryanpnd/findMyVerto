import React, { useState, useContext, useRef } from 'react';
import { Linking } from "react-native";
import { CustomButton } from "../CustomButton";
import { AppContext } from "../../../../context/MainApp";
import { useCustomAlert } from "../../miscellaneous/CustomAlert";
import { colors } from "../../../constants/colors";
import { AuthContext } from "../../../../context/Auth";
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ChangeServerBottomSheet from './ChangeServerBottomSheet';

export default function GeneralSettings() {
    const { checkForUpdates } = useContext(AppContext);
    const { auth, logout } = useContext(AuthContext);
    const customAlert = useCustomAlert();
    const [updateLoading, setUpdateLoading] = useState(false);

    const serverBottomSheetRef = useRef();

    const handleLogout = () => {
        customAlert.show(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Logout",
                    color: colors.red,
                    textColor: "white",
                    onPress: logout,
                },
                {
                    text: "Cancel",
                    color: "white",
                    textColor: "black",
                    onPress: () => console.log("Cancel Pressed"),
                },
            ]
        );
    };

    const handleOpenChangeServer = () => {
        serverBottomSheetRef.current?.open();
    };

    return (
        <>
            <CustomButton
                icon={<Feather name="server" size={15} color={colors.lightDark} />}
                title="Change Server"
                title2={auth.server.name}
                onPress={handleOpenChangeServer}
            />
            <CustomButton
                icon={<FontAwesome5 name="sync" size={15} color={colors.lightDark} />}
                title="Check for updates"
                onPress={() => checkForUpdates(setUpdateLoading, customAlert)}
                title2={updateLoading && "...checking"}
            />
            <CustomButton
                icon={<MaterialCommunityIcons name="information-outline" size={15} color={colors.lightDark} />}
                title="Developer Info"
                onPress={() => Linking.openURL('https://github.com/aryanpnd')}
            />
            <CustomButton
                icon={<AntDesign name="github" size={15} color={colors.lightDark} />}
                title="Contribute"
                onPress={() => Linking.openURL('https://github.com/aryanpnd/findmyverto')}
            />
            <CustomButton
                icon={<MaterialIcons name="logout" size={15} color={colors.lightDark} />}
                title="Logout"
                onPress={handleLogout}
            />

            {/* Render the ChangeServerBottomSheet */}
            <ChangeServerBottomSheet ref={serverBottomSheetRef} />

        </>
    );
}
