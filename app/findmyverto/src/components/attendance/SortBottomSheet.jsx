import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const SortBottomSheet = forwardRef(({ sortMethod, onSortMethodChange }, ref) => {
  const bottomSheetModalRef = useRef(null);

  // Expose open and close methods via the ref
  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
    close: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  const handleSortMethod = (method) => {
    onSortMethodChange(method);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['30%']}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.4} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <AntDesign name="sort-amount-desc" size={18} color="black" />
          <Text style={styles.title}>Sort Attendance By</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.sortOption, 
            sortMethod === 'none' && styles.selectedOption
          ]}
          onPress={() => handleSortMethod('none')}
        >
          <Text style={styles.sortOptionText}>Default</Text>
          {sortMethod === 'none' && (
            <AntDesign name="check" size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.sortOption,
            sortMethod === 'ascending' && styles.selectedOption
          ]}
          onPress={() => handleSortMethod('ascending')}
        >
          <Text style={styles.sortOptionText}>Lowest to Highest</Text>
          {sortMethod === 'ascending' && (
            <AntDesign name="check" size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.sortOption,
            sortMethod === 'descending' && styles.selectedOption
          ]}
          onPress={() => handleSortMethod('descending')}
        >
          <Text style={styles.sortOptionText}>Highest to Lowest</Text>
          {sortMethod === 'descending' && (
            <AntDesign name="check" size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  sortOptionText: {
    fontSize: 16,
  },
});

export default SortBottomSheet;