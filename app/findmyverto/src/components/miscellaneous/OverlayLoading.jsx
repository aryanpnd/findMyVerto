import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '../../constants/styles'
import LottieView from 'lottie-react-native';


export default function OverlayLoading({ loading, loadingText, loadingMsg, loadAnim }) {
  return (
    <View style={{
      display: loading ? "" : "none",
      flex: 1,
      width: '100%',
      height: '100%',
      zIndex: 2,
      backgroundColor: 'transparent',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={[{
        display: loading ? "" : "none",
        backgroundColor: 'white',
        borderRadius: 10,
        width: '60%',
        maxHeight: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
      }, globalStyles.elevation]}>
        <LottieView
          autoPlay
          style={{
            width: 150,
            height: 150,
            // backgroundColor:'red'
          }}
          source={loadAnim === "amongus" ? require('../../../assets/lotties/loading4.json') : require('../../../assets/lotties/loading1.json')}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>{loadingText}</Text>
        <Text style={[styles.textSmall, { marginBottom: 5, marginBottom: 40 }]}>{loadingMsg}</Text>

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },

});
