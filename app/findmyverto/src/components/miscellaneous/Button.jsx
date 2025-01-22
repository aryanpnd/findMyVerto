import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'
import LottieView from 'lottie-react-native'

export default function Button({ children, title, onPress, loading, styles, textStyles, bg, loadingTitle = "",loadAnim }) {
    return (
        <Pressable onPress={onPress} style={[buttonStyles, styles, { backgroundColor: loading ? colors.disabledBackground : bg }]} disabled={loading}>
            {loading ?
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{loadingTitle}</Text>
                    <LottieView
                        autoPlay
                        style={{
                            width: "15%",
                            height: 100,
                            // backgroundColor:'red'
                        }}
                        source={loadAnim === "amongus" ? require('../../../assets/lotties/loading4.json') : require('../../../assets/lotties/loading1.json')} />
                </View>
                :
                <Text style={[{ fontSize: 20, fontWeight: 'bold', color: 'white' }, textStyles]}>{title}</Text>
            }
        </Pressable>
    )
}

const buttonStyles = StyleSheet.create({
    width: "100%",
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
})