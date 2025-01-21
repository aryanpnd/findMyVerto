import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { globalStyles } from '../../constants/styles';

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
                <Pressable
                  key={index}
                  style={styles.button}
                  onPress={() => {
                    button.onPress?.();
                    setVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>{button.text}</Text>
                </Pressable>
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
