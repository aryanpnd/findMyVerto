import React, { useContext, useState } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';


export default function Login() {
  const { login } = useContext(AuthContext)

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    Toast.show({
      type: 'error',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
    Alert.alert('Credentials', `${username} + ${password}`);
    login(username, password)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <View style={styles.container}>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: "center" }}>
          <Text style={{ flex: 2, fontSize: 20, fontWeight: '500' }}>FindMyVerto</Text>
          <LottieView
            autoPlay
            style={{
              flex: 10,
              width: 500,
              height: 500,
            }}
            source={require('../../../assets/lotties/loginAnim2.json')}
          />
        </View>

        {/* login container */}
        <View style={styles.loginContainer}>
          {/* login text */}

          {/* login input container */}
          <ScrollView>
            <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 5,marginBottom:50,marginTop:40 }}>
              <Text style={{ fontSize: 45, fontWeight: 'bold' }}>LOGIN</Text>
              <Text style={{ fontSize: 15, fontWeight: '300' }}>with your UMS Credentials</Text>
            </View>
            <View style={{ flex: 4 }}>
              <TextInput
                value={username}
                onChangeText={(text) => setUsername(text)}
                placeholder={'Registration no.'}
                style={styles.input}
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder={'Password'}
                secureTextEntry={true}
                style={styles.input}
              />
            </View>

            <View style={{ flex: 4 }}>
              <TouchableOpacity onPress={() => console.log('hello')} style={{
                width: "100%", backgroundColor: '#d66f0c', height: 60, borderRadius: 15, flex: 1, alignItems: 'center', justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    // backgroundColor: '#c96806',
    padding: 6,
  },
  loginContainer: {
    flex: 4,
  },
  keyboardContainer: {
    flex: 7,
    padding: 10,
  },
  input: {
    height: 65,
    padding: 10,
    borderColor: 'black',
    marginBottom: 30,
    borderRadius: 15,
    backgroundColor: 'white',
  },
});
