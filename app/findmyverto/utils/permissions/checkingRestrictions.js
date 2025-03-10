// android\app\src\utils\push_notification_helper.js
// the function that check the Battery Optimization Enabled and it pops up turn off message.
export async function requestbatteryOptimizationTurnOff() {
    // 1. checks if battery optimization is enabled
    const batteryOptimizationEnabled =
        await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
        // 2. ask your users to disable the feature
        Alert.alert(
            'Restrictions Detected',
            'To ensure notifications are delivered, please disable battery optimization for the app.',
            [
                // 3. launch intent to navigate the user to the appropriate screen
                {
                    text: 'OK, open settings',
                    onPress: async () => await notifee.openBatteryOptimizationSettings(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    } else {
        console.log("Restrictions aren't detected for Battery Optimization");
    }
}

export async function requestPowerManagerSettingsTurnOff() {
    // 1. get info on the device and the Power Manager settings
    const powerManagerInfo = await notifee.getPowerManagerInfo();
    if (powerManagerInfo.activity) {
        // 2. ask your users to adjust their settings
        Alert.alert(
            'Restrictions Detected',
            'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
            [
                // 3. launch intent to navigate the user to the appropriate screen
                {
                    text: 'OK, open settings',
                    onPress: async () => await notifee.openPowerManagerSettings(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    } else {
        console.log("Restrictions aren't detected for Power Managment.");
    }
}