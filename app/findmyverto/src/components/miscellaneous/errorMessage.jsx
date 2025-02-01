import LottieView from 'lottie-react-native'
import { Text, View } from 'react-native'
import Button from './Button'

export const ErrorMessage = ({ handleFetch, loading, messageText,buttonStyles }) => {
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
            <Text>{messageText}</Text>
            <View style={buttonStyles}>
                <Button
                    bg={"black"}
                    loading={loading}
                    onPress={async () => await handleFetch()}
                    title={"Retry"}
                    textStyles={{ fontSize: 15 }}
                    styles={{ hieght: 10 }}
                />
            </View>
        </View>
    )
}