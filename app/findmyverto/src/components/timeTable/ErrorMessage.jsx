const { default: LottieView } = require('lottie-react-native')
const { View, Text } = require('react-native')
const { default: Button } = require('../miscellaneous/Button')

export const ErrorMessage = ({ handleFetchTimetable, timetableLoading, buttonHeight, ErrorMessage }) => {
    return (
        <View style={{ alignItems: "center", justifyContent: "center", height: "80%", gap: 8 }}>
            <LottieView
                autoPlay
                style={{
                    width: 150,
                    height: 150,
                }}
                source={require('../../../assets/lotties/error.json')}
            />
            <Text>...while getting the {ErrorMessage}</Text>
            <View style={[{ height: "20%", width: "50%" }, buttonHeight && { height: buttonHeight }]}>
                <Button
                    bg={"black"}
                    loading={timetableLoading}
                    onPress={async () => await handleFetchTimetable()}
                    title={"Retry"}
                    textStyles={{ fontSize: 15 }}
                    styles={{ height: 10 }}
                />
            </View>
        </View>
    )
}