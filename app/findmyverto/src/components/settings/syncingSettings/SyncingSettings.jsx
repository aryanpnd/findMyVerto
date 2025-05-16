import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { CustomButton } from '../CustomButton';
import DynamicPickerModal from './DynamicPickerModal';
import {
  AttendanceSyncTime,
  TimetableSyncTime,
  ExamsSyncTime,
  AssignmentsSyncTime,
  MyMessagesSyncTime,
  DrivesSyncTime,
  MakeupSyncTime,
} from '../../../../utils/settings/SyncAndRetryLimits';

// Option sets for each feature

// Attendance options: numbers in hours
const attendanceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 24, 48];

// Timetable options: objects with value (in hours) and custom label
const timetableOptions = [
  { value: 12, label: '12 hours' },
  { value: 24, label: '1 day' },
  { value: 120, label: '5 days' },
  { value: 240, label: '10 days' },
  { value: 480, label: '20 days' },
  { value: 720, label: '1 month' },
  { value: 1440, label: '2 months' },
];

// Makeup options: objects with value (in hours) and custom label
const makeupOptions = [
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '7 days' },
  { value: 336, label: '2 weeks' },
];

// Exams options (in hours)
const examOptions = [
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '7 days' },
  { value: 720, label: '1 month' },
  { value: 2160, label: '3 months' },
];

// Assignments options (in hours)
const assignmentOptions = [
  { value: 12, label: '12 hours' },
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '7 days' },
  { value: 240, label: '10 days' },
  { value: 336, label: '2 weeks' },
];

// MyMessages options (in hours)
const myMessagesOptions = [
  { value: 1, label: '1 hour' },
  { value: 6, label: '6 hours' },
  { value: 12, label: '12 hours' },
  { value: 24, label: '1 day' },
  { value: 48, label: '2 days' },
  { value: 168, label: '1 week' },
];

// Drives options (in hours) – adjust as needed
const drivesOptions = [
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '7 days' },
];

export default function SyncingSettings() {
  // modalType will be one of:
  // 'attendance', 'timetable', 'exams', 'assignments', 'myMessages', 'drives'
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Retrieve stored values (in ms), then convert to hours.
  const initialAttendanceTime =
    AttendanceSyncTime() === 0 ? 0 : AttendanceSyncTime() / 3600000;
  const initialTimetableTime =
    TimetableSyncTime() === 0 ? 0 : TimetableSyncTime() / 3600000;
  const initialExamsTime =
    ExamsSyncTime() === 0 ? 0 : ExamsSyncTime() / 3600000;
  const initialAssignmentsTime =
    AssignmentsSyncTime() === 0 ? 0 : AssignmentsSyncTime() / 3600000;
  const initialMyMessagesTime =
    MyMessagesSyncTime() === 0 ? 0 : MyMessagesSyncTime() / 3600000;
  const initialDrivesTime =
    DrivesSyncTime() === 0 ? 0 : DrivesSyncTime() / 3600000;
  const initialMakeupTime =
    MakeupSyncTime() === 0 ? 0 : MakeupSyncTime() / 3600000;

  const [attendanceTime, setAttendanceTime] = useState(initialAttendanceTime);
  const [timetableTime, setTimetableTime] = useState(initialTimetableTime);
  const [examsTime, setExamsTime] = useState(initialExamsTime);
  const [assignmentsTime, setAssignmentsTime] = useState(initialAssignmentsTime);
  const [myMessagesTime, setMyMessagesTime] = useState(initialMyMessagesTime);
  const [drivesTime, setDrivesTime] = useState(initialDrivesTime);
  const [makeupTime, setMakeupTime] = useState(initialMakeupTime);

  // Open the modal for a given feature type.
  const openModalFor = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  // Handle selection from the modal.
  // For non-Off values, the selected number (hours) is converted to ms.
  const handleSelectTime = (selectedOption) => {
    if (modalType === 'attendance') {
      const newTime = selectedOption;
      AttendanceSyncTime(newTime === 0 ? 0 : newTime * 3600000);
      setAttendanceTime(newTime);
    } else if (modalType === 'timetable') {
      const newValue = selectedOption.value;
      TimetableSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setTimetableTime(newValue);
    } else if (modalType === 'exams') {
      const newValue = selectedOption.value;
      ExamsSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setExamsTime(newValue);
    } else if (modalType === 'assignments') {
      const newValue = selectedOption.value;
      AssignmentsSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setAssignmentsTime(newValue);
    } else if (modalType === 'myMessages') {
      const newValue = selectedOption.value;
      MyMessagesSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setMyMessagesTime(newValue);
    } else if (modalType === 'drives') {
      const newValue = selectedOption.value;
      DrivesSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setDrivesTime(newValue);
    } else if (modalType === 'makeup') {
      const newValue = selectedOption.value;
      MakeupSyncTime(newValue === 0 ? 0 : newValue * 3600000);
      setMakeupTime(newValue);
    }
    setModalVisible(false);
    setModalType(null);
  };

  // Set picker options, header, selected item, and label extractor based on feature type.
  let pickerOptions = [];
  let modalHeader = '';
  let selectedItem;
  let labelExtractor;

  if (modalType === 'attendance') {
    pickerOptions = [0, ...attendanceOptions];
    modalHeader = 'Set auto syncing time for attendance';
    selectedItem = attendanceTime;
    labelExtractor = (item) =>
      item === 0 ? 'Off' : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'timetable') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...timetableOptions];
    modalHeader = 'Set auto syncing time for timetable';
    selectedItem =
      timetableTime === 0
        ? { value: 0, label: 'Off' }
        : timetableOptions.find((opt) => opt.value === timetableTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'exams') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...examOptions];
    modalHeader = 'Set auto syncing time for exams';
    selectedItem =
      examsTime === 0
        ? { value: 0, label: 'Off' }
        : examOptions.find((opt) => opt.value === examsTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'assignments') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...assignmentOptions];
    modalHeader = 'Set auto syncing time for assignments';
    selectedItem =
      assignmentsTime === 0
        ? { value: 0, label: 'Off' }
        : assignmentOptions.find((opt) => opt.value === assignmentsTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'myMessages') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...myMessagesOptions];
    modalHeader = 'Set auto syncing time for messages';
    selectedItem =
      myMessagesTime === 0
        ? { value: 0, label: 'Off' }
        : myMessagesOptions.find((opt) => opt.value === myMessagesTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'drives') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...drivesOptions];
    modalHeader = 'Set auto syncing time for drives';
    selectedItem =
      drivesTime === 0
        ? { value: 0, label: 'Off' }
        : drivesOptions.find((opt) => opt.value === drivesTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  } else if (modalType === 'makeup') {
    pickerOptions = [{ value: 0, label: 'Off' }, ...makeupOptions];
    modalHeader = 'Set auto syncing time for makeup';
    selectedItem =
      makeupTime === 0
        ? { value: 0, label: 'Off' }
        : makeupOptions.find((opt) => opt.value === makeupTime);
    labelExtractor = (item) =>
      typeof item === 'object'
        ? item.value === 0
          ? 'Off'
          : item.label
        : item === 0
          ? 'Off'
          : `${item} hour${item > 1 ? 's' : ''}`;
  }

  return (
    <View>
      <DynamicPickerModal
        visible={modalVisible}
        header={modalHeader}
        data={pickerOptions}
        selectedItem={selectedItem}
        onSelect={handleSelectTime}
        onClose={() => {
          setModalVisible(false);
          setModalType(null);
        }}
        labelExtractor={labelExtractor}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/attendance.png')} />}
        title="Attendance"
        title2={
          attendanceTime === 0
            ? 'Off'
            : `${attendanceTime} hour${attendanceTime > 1 ? 's' : ''}`
        }
        onPress={() => openModalFor('attendance')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/schedule.png')} />}
        title="Timetable"
        title2={
          timetableTime === 0
            ? 'Off'
            : timetableOptions.find((opt) => opt.value === timetableTime)?.label ||
            `${timetableTime} hrs`
        }
        onPress={() => openModalFor('timetable')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/makeup.png')} />}
        title="Makeup"
        title2={
          makeupTime === 0
            ? 'Off'
            : makeupOptions.find((opt) => opt.value === makeupTime)?.label ||
            `${makeupTime} hrs`
        }
        onPress={() => openModalFor('makeup')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/exam.png')} />}
        title="Exams"
        title2={
          examsTime === 0
            ? 'Off'
            : examOptions.find((opt) => opt.value === examsTime)?.label ||
            `${examsTime} hrs`
        }
        onPress={() => openModalFor('exams')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/assignment.png')} />}
        title="Assignments"
        title2={
          assignmentsTime === 0
            ? 'Off'
            : assignmentOptions.find((opt) => opt.value === assignmentsTime)?.label ||
            `${assignmentsTime} hrs`
        }
        onPress={() => openModalFor('assignments')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/myMessages.png')} />}
        title="My Messages"
        title2={
          myMessagesTime === 0
            ? 'Off'
            : myMessagesOptions.find((opt) => opt.value === myMessagesTime)?.label ||
            `${myMessagesTime} hrs`
        }
        onPress={() => openModalFor('myMessages')}
      />
      <CustomButton
        icon={<Image style={styles.icon} source={require('../../../../assets/icons/interview.png')} />}
        title="My Drives"
        title2={
          drivesTime === 0
            ? 'Off'
            : drivesOptions.find((opt) => opt.value === drivesTime)?.label ||
            `${drivesTime} hrs`
        }
        onPress={() => openModalFor('drives')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 18,
    objectFit: 'contain',
  },
});