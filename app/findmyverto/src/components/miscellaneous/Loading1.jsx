import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


export default function Loading1({ loading, loadingText, loadingMsg, loadAnim, textColor }) {
    return (
        <>
            <View style={{
                display: loading ? "" : "none",
                alignItems: 'center',
            }}>
                <LottieView
                    autoPlay
                    style={{
                        width: 100,
                        height: 100,
                    }}
                    source={loadAnim === "amongus" ? require('../../../assets/lotties/loading4.json') : loadAnim === "loadingtext" ? require('../../../assets/lotties/loading5.json') : require('../../../assets/lotties/loading1.json')}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: textColor }}>{loadingText}</Text>
                <Text style={[styles.textSmall, { marginBottom: 5, marginBottom: 40, color: textColor }]}>{loadingMsg}</Text>

            </View>
        </>
    )
}


const styles = StyleSheet.create({
    textSmall: { fontWeight: '400' },

});
