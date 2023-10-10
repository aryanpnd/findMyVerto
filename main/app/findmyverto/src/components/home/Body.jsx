import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'

export default function Body() {
    return (
        <View style={styles.body}>
          <ScrollView>
            
            <View>
              
            </View>

          </ScrollView>
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