import React, { useRef, useState } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import { globalStyles, HEIGHT, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import PagerButtons from '../miscellaneous/PagerButtons';
import CoursesCard from './CoursesCard';
import { useNavigation } from '@react-navigation/native';

const CourseDetailsModal = ({ visible, classes, courses, onClose }) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Create buttons using the 'class' property from each classDetails
  const buttons = classes ? classes.map((classDetails) => classDetails.class) : [];

  // Each page has a fixed width
  const pageWidth = WIDTH(80);

  const onCLick = (i) => {
    scrollViewRef.current?.scrollTo({ x: i * pageWidth, animated: true });
    setSelectedIndex(i);
  };

  const handleNavigate = (classDetails) => {
    navigation.navigate('Attendance', {
      courseCode: classDetails.class,
    });
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      {/* 
        Wrap the entire overlay in a TouchableOpacity so that touching anywhere outside 
        the modal content triggers onClose. We use TouchableWithoutFeedback inside to 
        prevent closing when touching inside the modal container.
      */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.modalContainer, globalStyles.elevation]}>
            <View style={styles.header}>
              <PagerButtons
                buttons={buttons}
                onClick={onCLick}
                scrollX={scrollX}
                containerWidth={WIDTH(60)}
                containerHeight={HEIGHT(5)}
                pageWidth={pageWidth}
                buttonColor={colors.primary}
              />
            </View>

            {/* Scrollable content for each course */}
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

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNavigate(classes[selectedIndex])}
            >
              <Image
                source={require('../../../assets/icons/attendance.png')}
                style={{ height: 20, width: 20 }}
              />
              <Text style={styles.buttonText}>View Attendance</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default CourseDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: WIDTH(80),
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
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: colors.secondary
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
