import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { HEIGHT, WIDTH, globalStyles } from '../../../constants/styles';
import { colors } from '../../../constants/colors';

const DynamicPickerModal = ({
  visible,
  header,
  data,
  selectedItem,
  onSelect,
  onClose,
  labelExtractor = (item) => item.toString(),
  itemHeight = 50,
  modalStyle,
  overlayStyle,
}) => {
  const flatListRef = useRef(null);
  const selectedIndex = data.findIndex((item) => {
    // Compare numbers directly or compare object.value if objects.
    if (typeof item === 'object' && typeof selectedItem === 'object') {
      return item.value === selectedItem.value;
    }
    return item === selectedItem;
  });

  useEffect(() => {
    if (visible && flatListRef.current && selectedIndex !== -1) {
      flatListRef.current.scrollToIndex({ index: selectedIndex, animated: true });
    }
  }, [visible, selectedIndex]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { height: itemHeight },
        // For objects compare by value; for numbers directly.
        (typeof item === 'object'
          ? item.value === selectedItem?.value
          : item === selectedItem) && styles.selectedOption,
      ]}
      onPress={() => onSelect(item)}
    >
      <Text
        style={[
          styles.optionText,
          (typeof item === 'object'
            ? item.value === selectedItem?.value
            : item === selectedItem) && { color: 'white' },
        ]}
      >
        {labelExtractor(item)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        <View style={[styles.overlay, overlayStyle]}>
          <View style={[styles.alertBox, globalStyles.elevation, modalStyle]}>
            <Text style={styles.headerText}>{header}</Text>
            <FlatList
              ref={flatListRef}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              getItemLayout={(data, index) => ({
                length: itemHeight,
                offset: itemHeight * index,
                index,
              })}
              style={{ maxHeight: HEIGHT(30) }}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      {/* </SafeAreaView> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(5),
  },
  alertBox: {
    maxWidth: WIDTH(80),
    width: '100%',
    paddingHorizontal: WIDTH(5),
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 12,
    color: 'grey',
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: colors.whiteLight,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'grey',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default DynamicPickerModal;
