import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { globalStyles } from '../../constants/styles';
import ButtonV1 from './buttons/ButtonV1';

const CustomAlert = (() => {
  let alertInstance;

  const AlertComponent = () => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttons, setButtons] = useState([]);

    alertInstance = {
      show: (title, message, buttons = [{ text: 'OK' }]) => {
        setTitle(title);
        setMessage(message);
        setButtons(buttons);
        setVisible(true);
      },
      hide: () => setVisible(false),
    };

    return (
      <Modal
        transparent
        statusBarTranslucent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.alertBox,globalStyles.elevation]}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <ButtonV1
                  key={index}
                  style={[styles.button,button.color&&{backgroundColor:button.color}]}
                  onPress={() => {
                    button.onPress?.();
                    setVisible(false);
                  }}
                  scaleInValue={0.9}
                >
                  <Text style={[styles.buttonText,button.textColor&&{color:button.textColor}]}>{button.text}</Text>
                </ButtonV1>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return { AlertComponent, alertInstance: () => alertInstance };
})();

export const useCustomAlert = () => CustomAlert.alertInstance();

export default CustomAlert.AlertComponent;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    maxWidth: "80%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'black',
    borderRadius: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
