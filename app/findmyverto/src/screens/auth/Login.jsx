import React, { useContext, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { API_URL, AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../constants/colors';
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert';
import Button from '../../components/miscellaneous/Button';
import { StatusBar } from 'expo-status-bar';
import { HEIGHT, WIDTH } from '../../constants/styles';
import AwesomeButton from 'react-native-really-awesome-button';

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const customAlert = useCustomAlert();

  const [regno, setRegno] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const passwordRef = useRef(null);

  const login = async () => {
    if (!regno) {
      customAlert.show('Please enter the registration number');
      return;
    } else if (!password) {
      customAlert.show('Please enter the password');
      return;
    }

    setLoading(true);
    await axios.post(`${API_URL}/student/login`, { reg_no: regno, password: password }).then(async (result) => {
      if (result.data.login) {
        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });
        const daysLeft = result.data.passwordExpiry?.match(/\d+(?= days)/);
        const expiry = {
          days: daysLeft ? parseInt(daysLeft[0]) : 0,
          updatedAt: new Date().toISOString(),
        };
        await setAuth({ authenticated: true, reg_no: regno, password: password, passwordExpiry: expiry });
        setLoading(false);
      } else {
        customAlert.show('Login failed', result.data.message, [
          { text: 'OK', onPress: () => console.log('Confirmed') },
        ]);
        setLoading(false);
      }
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: `${err}`,
      });
      console.log(err);
      setLoading(false);
    });
  };

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
        <CustomAlert />
      </View>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={isFocused ? colors.whitePrimary : colors.primary} />
        <View style={styles.container}>
          {/* Hide logo and animation when text input is focused */}
          {!isFocused && (
            <View style={styles.topContainer}>
              <Text style={{ fontSize: 25, fontWeight: '500', color: 'white' }}>FindMyVerto</Text>
              <LottieView
                autoPlay
                style={{
                  flex: 1,
                  width: 350,
                  height: 350,
                }}
                source={require('../../../assets/lotties/loginAnim2.json')}
              />
            </View>
          )}

          {/* login container */}
          <View style={[styles.loginContainer, isFocused && styles.focusedLoginContainer]}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 5, marginBottom: 20 }}>
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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <View style={{ flex: 1 }}>
                  <TextInput
                    ref={passwordRef}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="UMS Password"
                    cursorColor={'orange'}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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
                <LoginButton onPress={login} loading={loading} />
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const LoginButton = ({ onPress, loading }) => {
  return (
    <AwesomeButton
      width={WIDTH(90)}
      height={HEIGHT(7)}
      borderRadius={15}
      raiseLevel={loading ? 0 : 5}
      // Change backgroundColor based on loading state
      backgroundColor={loading ? colors.disabledBackground : colors.secondary}
      backgroundDarker={loading ? colors.disabledBackground : colors.primary}
      debouncedPressTime={200}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Logging in...</Text>
          <LottieView
            autoPlay
            loop
            style={styles.loadingAnim}
            source={
              // Use your preferred loading animation file
              require('../../../assets/lotties/loading4.json')
            }
          />
        </View>
      ) : (
        <Text style={styles.buttonText}>Login</Text>
      )}
    </AwesomeButton>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
  },
  topContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    flex: 4
  },
  loginContainer: {
    flex: 4,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#f1f1f1",
  },
  focusedLoginContainer: {
    height: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    top: 20,
  },
  textSmall: { fontSize: 12, fontWeight: '400', color: 'grey' },
  textLarge: { fontSize: 30, fontWeight: 'bold', color: '#333' },

  //login button
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  loadingAnim: {
    width: 50,
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
