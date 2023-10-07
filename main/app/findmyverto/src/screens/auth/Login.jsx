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
        setAuth({
          token: result.data.token,
          regNo:regno,
          pass:password,
          authenticated: true
        })
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
        await SecureStore.setItemAsync("TOKEN", result.data.token)
        await SecureStore.setItemAsync("REGNO", regno)
        await SecureStore.setItemAsync("PASS", password)
        Toast.show({
          type: 'success',
          text1: `${result.data.message}`,
        });
        await SecureStore.setItemAsync("AUTHENTICATED",JSON.stringify(true));
        setLoading(false)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: `Wrong Ums username and password`,
        });
        alert("Wrong Ums username and password")
        setLoading(false)
      }
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: `${err}`,
      });
      console.log(err);
      setLoading(false)
    })
  }

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
      </View>
      <SafeAreaView style={styles.container}>

        <View style={[{
          display: loading ? "" : "none",
          flex: 1,
          backgroundColor: 'white',
          position: 'absolute',
          padding: 20,
          borderRadius: 10,
          width: '60%',
          maxHeight: '80%',
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },styles.elevation,styles.shadowProp]}>
          <LottieView
            autoPlay
            style={{
              width: 150,
              height: 150,
              // backgroundColor:'red'
            }}
            source={require('../../../assets/lotties/loading4.json')}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold',marginVertical:10 }}>Logging...</Text>
            <Text style={[styles.textSmall, { marginBottom: 5,marginBottom:40 }]}>This may take 40-50 seconds if you're Logging for the first time, Depending upon UMS server</Text>

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
            <ScrollView >
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
                  onSubmitEditing={() => passwordRef.current.focus()}
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
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <FontAwesome5
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color={showPassword ? '#aaa' : '#d66f0c'}
                    style={styles.icon}
                    onPress={() => setShowPassword(!showPassword)}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 6,
  },
  loginContainer: {
    flex: 4,
    height: '100%',
    width: '100%'
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
  textSmall: { fontWeight: '400' },
  textLarge: { fontSize: 45, fontWeight: 'bold',color:'#333'},
  shadowProp: {  
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  },  
  elevation: {  
    shadowColor: '#52006A',  
    elevation: 20,  
  },  
});
