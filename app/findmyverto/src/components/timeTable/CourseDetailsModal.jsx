import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, TouchableWithoutFeedback, Image, Pressable } from 'react-native';
import { globalStyles, HEIGHT, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import PagerButtons from '../miscellaneous/PagerButtons';
import CoursesCard from './CoursesCard';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import ButtonV1 from '../miscellaneous/buttons/ButtonV1';

const CourseDetailsModal = forwardRef(function CourseDetailsModal(props, ref) {
  const { friend, classes, courses } = props;
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    console.log("classes", classes);
  }, [selectedIndex]);

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

  // Create buttons using the 'class' property from each classDetails
  const buttons = classes ? classes.map((classDetails) => classDetails.class) : [];

  // Each page has a fixed width
  const pageWidth = WIDTH(90);

  const onCLick = (i) => {
    scrollViewRef.current?.scrollTo({ x: i * pageWidth, animated: true });
    setSelectedIndex(i);
  };

  const handleNavigate = (classDetails) => {
    if (friend) {
      navigation.navigate('FriendAttendance', {
        id: friend.id,
        name: friend.name,
        courseCode: classDetails.class,
      });
    } else {
      navigation.navigate('Attendance', {
        courseCode: classDetails.class,
      });
    }
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['45%']}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.4} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetView style={styles.modalContainer}>
        <View style={styles.header}>
          <PagerButtons
            buttons={buttons}
            onClick={onCLick}
            scrollX={scrollX}
            containerWidth={WIDTH(90)}
            containerHeight={HEIGHT(5)}
            pageWidth={pageWidth}
            buttonColor={colors.primary}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / pageWidth);
            setSelectedIndex(index);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {classes?.map((classDetails, index) => (
            <View style={styles.content} key={index}>
              <CoursesCard
                course={courses[classDetails.class]}
                subjectCode={classDetails.class}
              />
            </View>
          ))}
        </ScrollView>

        <ButtonV1
          style={styles.button}
          onPress={() => handleNavigate(classes[selectedIndex])}
        >
          <Text style={styles.buttonText}>View Attendance</Text>
        </ButtonV1>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default CourseDetailsModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: WIDTH(90),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: HEIGHT(1.5),
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});