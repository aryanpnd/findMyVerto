import React, { useContext, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export default function Login() {
  const { setAuth } = useContext(AuthContext)

  const [regno, setRegno] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const passwordRef = useRef(null);

  const login = async () => {
    if (!regno) {
      alert('Please fill the registration number')
      return
    }
    else if (!password) {
      alert('Please fill the password')
      return
    }

    setLoading(true)
    await axios.post(`${API_URL}/api/auth/login`, { regNo: regno, password: password }).then(async (result) => {
      if (result.data.status) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
        await SecureStore.setItemAsync("TOKEN", result.data.token)
        setAuth({
          token: result.data.token,
          authenticated: true
        })
        Toast.show({
          type: 'success',
          text1: `${result.data.message}`,
        });
        setLoading(false)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: `Wrong Ums username and password`,
        });
        alert("Wrong Ums username and password")
        console.log(result.data.message);
        setLoading(false)
      }
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: `${err}`,
      });
      setLoading(false)
    })
  }

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={styles.container}>

        <View style={{
          display: loading ? "" : "none",
          flex: 1,
          backgroundColor: '#ccd0d3e8',
          position: 'absolute',
          height: 860,
          width: 400,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <LottieView
            autoPlay
            style={{
              width: 150,
              height: 150,
            }}
            source={require('../../../assets/lotties/loading4.json')}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Logging...</Text>
          <Text style={styles.textSmall}></Text>
          <Text style={styles.textSmall}>This may take 40-50 sec</Text>
          <Text style={styles.textSmall}>if you're Logging for the first time</Text>
          <Text style={styles.textSmall}>Depending upon UMS server</Text>

        </View>

        <View style={styles.container}>
          <View style={{ flex: 3, justifyContent: 'center', alignItems: "center" }}>
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
              <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 5, marginBottom: 50, marginTop: 40 }}>
                <Text style={styles.textLarge}>LOGIN</Text>
                <Text style={styles.textSmall}>with your UMS Credentials</Text>
              </View>
              <View style={{ flex: 4 }}>
                <TextInput
                  value={regno}
                  onChangeText={(text) => setRegno(text)}
                  placeholder={'Registration no.'}
                  style={styles.input}
                  keyboardType='decimal-pad'
                  cursorColor={'orange'}
                  onSubmitEditing={()=>passwordRef.current.focus()}
                />
                <View style={{ flex: 1 }}>
                  <TextInput
                    ref={passwordRef}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="Ums Password"
                    cursorColor={'orange'}
                    onSubmitEditing={()=>Keyboard.dismiss()}
                  />
                  <FontAwesome5
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color={showPassword ? '#aaa' : '#d66f0c'}
                    style={styles.icon}
                    onPress={()=>setShowPassword(!showPassword)}
                  />
                </View>
              </View>

              <View style={{ flex: 4 }}>
                <TouchableOpacity onPress={login} style={{
                  width: "100%", backgroundColor: '#d66f0c', height: 60, borderRadius: 15, flex: 1, alignItems: 'center', justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

      </SafeAreaView>
    </>
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
  icon: {
    position: 'absolute',
    right: 20,
    top: 20
  },
  textSmall: { fontSize: 15, fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold' }
});
