import React, { useContext, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import OverlayLoading from '../../components/miscellaneous/OverlayLoading';
import { colors } from '../../constants/colors';
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert';
import Button from '../../components/miscellaneous/Button';

export default function Login() {
  const { setAuth } = useContext(AuthContext)
  const customAlert = useCustomAlert();

  const [regno, setRegno] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef(null);

  const login = async () => {
    if (!regno) {
      customAlert.show('Please enter the registration number')
      return
    }
    else if (!password) {
      customAlert.show('Please enter the password')
      return
    }

    setLoading(true)
    await axios.post(`${API_URL}/student/login`, { reg_no: regno, password: password }).then(async (result) => {
      if (result.data.login) {
        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });
        const daysLeft = result.data.passwordExpiry?.match(/\d+(?= days)/);
        const expiry = {
          days: daysLeft ? parseInt(daysLeft[0]) : 0,
          updatedAt: new Date().toISOString()
        };
        await setAuth({ authenticated: true, reg_no: regno, password: password, passwordExpiry: expiry });
        setLoading(false);
      } else {
        customAlert.show('Login failed', result.data.message, [
          { text: 'OK', onPress: () => console.log('Confirmed') }
        ])
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
        <CustomAlert />
      </View>
      <SafeAreaView style={styles.container}>
        {/* <OverlayLoading loading={loading} loadAnim={"amongus"} loadingMsg={"This may take 40-50 seconds if you're Logging for the first time, Depending upon UMS server"} loadingText={"Logging..."} /> */}
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
                    color={showPassword ? '#aaa' : colors.primary}
                    style={styles.icon}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </View>
              </View>

              <View style={{ flex: 4 }}>
                <Button title="Login" onPress={login} loading={loading} setLoading={setLoading} bg={colors.primary} loadingTitle="Logging...it will take a few seconds" loadAnim={"amongus"} />
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
  textLarge: { fontSize: 45, fontWeight: 'bold', color: '#333' },

});
