import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { colors } from '../../constants/colors';

const { height, width } = Dimensions.get('window');


export default function EmptyRequests({ withButton, navigation,btnText,text,route }) {
    return (
      <View style={{ height: height * 0.5, justifyContent: "center", gap: 10, alignItems: "center" }}>
        <LottieView
          autoPlay
          style={{
            width: width * 0.5,
            height: width * 0.5,
            opacity: 0.8
          }}
          source={require('../../../assets/lotties/empty.json')}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {!withButton ? <Text style={styles.text1}>{text}</Text> : <Text style={styles.text1}>{text}</Text>}
  
          {withButton && 
          <TouchableOpacity onPress={() => navigation.navigate(route)}>
            <Text style={{ backgroundColor: colors.lightDark, color: "white", padding: 10, paddingHorizontal: 15, borderRadius: 25, marginTop: 5, fontWeight: "500" }}>{btnText}</Text>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }

  const styles = StyleSheet.create({
    text1: { fontSize: 16, textAlign: "center", fontWeight: "500", color: "grey" },
  })