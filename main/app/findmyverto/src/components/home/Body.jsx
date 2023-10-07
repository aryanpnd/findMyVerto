import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Body({logout}) {
    return (
        <View style={styles.body}>
            <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  body:{
    flex:5,
    width: '100%',
    height: '100%',
    // backgroundColor: '#d4d8dc8f',
    backgroundColor:'white',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
})