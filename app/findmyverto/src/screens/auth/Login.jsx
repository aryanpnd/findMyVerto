import React, { useContext, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard, Linking,Image } from 'react-native';
import { AuthContext } from '../../../context/Auth';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Feather, FontAwesome5, Octicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../constants/colors';
import CustomAlert, { useCustomAlert } from '../../components/miscellaneous/CustomAlert';
import { StatusBar } from 'expo-status-bar';
import { HEIGHT, WIDTH } from '../../constants/styles';
import AwesomeButton from 'react-native-really-awesome-button';
import ChangeServerBottomSheet from '../../components/settings/GeneralSettings/ChangeServerBottomSheet';
// import { Image } from 'expo-image';

export default function Login() {
  const { auth, setAuth } = useContext(AuthContext);
  const customAlert = useCustomAlert();

  const [regno, setRegno] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const passwordRef = useRef(null);
  const serverBottomSheetRef = useRef();

  const openTerms = () => {
    // customAlert.show(
    //   'Terms and Conditions',
    //   'By accessing and using Find My Verto, you confirm that you have read and accepted these terms. You agree to use the app responsibly and to protect your login details. The app accesses your academic data only to deliver its services. Find My Verto is provided on an "as is" basis, without any warranties, and the developers are not liable for any errors, damages, or losses arising from its use.'
    // );
    Linking.openURL('https://findmyverto.aryanpnd.in/terms-and-conditions.html');
  };

  const login = async () => {
    if (!regno) {
      customAlert.show('Please enter the registration number');
      return;
    } else if (!password) {
      customAlert.show('Please enter the password');
      return;
    } else if (!acceptedTerms) {
      customAlert.show('Please accept the Terms and Conditions');
      return;
    }

    setLoading(true);
    await axios
      .post(`${auth.server.url}/student/login`, { reg_no: regno, password: password })
      .then(async (result) => {
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
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: `${err}`,
        });
        console.log(err);
        setLoading(false);
      });
  };

  const handleOpenChangeServer = () => {
    serverBottomSheetRef.current?.open();
  };

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <Toast />
        <CustomAlert />
        <ChangeServerBottomSheet ref={serverBottomSheetRef} />
      </View>

      {/* Make StatusBar transparent to show image underneath */}
      <StatusBar translucent backgroundColor="transparent" />

      {/* Background image that extends under status bar */}
      {!isFocused && (
        <Image
          source={require('../../../assets/illustrations/loginScreen.png')}
          style={styles.fullscreenBackground}
        />
      )}

      <SafeAreaView style={[styles.container, { backgroundColor: isFocused ? colors.whitePrimary : 'transparent' }]}>
        <View style={styles.container}>
          {!isFocused && (
            <View style={styles.topContainer}>
              {/* <Text style={styles.appTitle}>FindMyVerto</Text> */}
            </View>
          )}

          {/* login container */}
          <View style={[styles.loginContainer, isFocused && styles.focusedLoginContainer]}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 5,
                  marginBottom: 20,
                }}
              >
                <View>
                  <Text style={styles.textLarge}>LOGIN</Text>
                  <Text style={styles.textSmall}>with your UMS Credentials</Text>
                </View>

                <TouchableOpacity style={{ gap: 10 }} onPress={handleOpenChangeServer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Octicons name="dot-fill" size={12} color={colors.green} />
                    <Text style={{ fontSize: 12, color: 'grey' }}>{auth.server.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Feather name="server" size={12} color={'grey'} />
                    <Text style={{ color: 'grey', fontSize: 12 }}>Change server</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 4 }}>
                <TextInput
                  value={regno}
                  onChangeText={(text) => setRegno(text)}
                  placeholder={'Registration no.'}
                  style={styles.input}
                  keyboardType="decimal-pad"
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

              {/* Terms & Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={styles.checkbox}>
                  {acceptedTerms ? (
                    <FontAwesome5 name="check-square" size={24} color={colors.primary} />
                  ) : (
                    <FontAwesome5 name="square" size={24} color="grey" />
                  )}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink} onPress={openTerms}>
                    Terms and Conditions
                  </Text>
                </Text>
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
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fullscreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '55%',
    flex: 1,
    resizeMode: 'cover',
    zIndex: 0,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  topContainer: {
    flex: 4,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  fullScreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: 1, // Place behind the text
  },
  appTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: 'white',
    zIndex: 2, // Place above the image
    alignSelf: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  loginContainer: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f1f1f1',
    marginTop: -20, // Pull up the container to create overlap with image
    zIndex: 3, // Place above the image
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
  // Terms and Conditions styles
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: 'grey',
  },
  termsLink: {
    color: colors.secondary,
    textDecorationLine: 'underline',
  },
  // login button
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
