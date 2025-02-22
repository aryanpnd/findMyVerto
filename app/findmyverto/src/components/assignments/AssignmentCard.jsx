import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import { globalStyles, WIDTH } from '../../constants/styles';
import { colors } from '../../constants/colors';
import { FontAwesome6 } from '@expo/vector-icons';

export default function AssignmentCard({ assignment, courses }) {
  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <Pressable style={styles.card} onPress={toggleExpand}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.text1}>
          {assignment.course_code} - {courses[assignment?.course_code]?.course_title}
        </Text>
      </View>
      {/* <View style={styles.divider}></View> */}

      {/* Always visible Marks row */}
      <View style={styles.infoContainer1}>
        <Text style={styles.text2}>Marks</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {assignment.marks_obtained === "" ? (
            <FontAwesome6 name="clock" size={10} color="black" />
          ) : (
            <Text style={styles.text2}>{assignment.marks_obtained}</Text>
          )}
          <Text style={styles.text2}>/</Text>
          {assignment.total_marks === "" ? (
            <FontAwesome6 name="clock" size={10} color="black" />
          ) : (
            <Text style={styles.text2}>{assignment.total_marks}</Text>
          )}
        </View>
      </View>


      {/* Extra Info (animated via LayoutAnimation) */}
      {expanded && (
        <View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Upload Date</Text>
            <Text style={[styles.text2, { maxWidth: "30%" }]}>{assignment.upload_date}</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Submission Date</Text>
            <Text style={[styles.text2, { maxWidth: "30%" }]}>{assignment.submission_date?.trim()}</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Submission Type</Text>
            <Text style={[styles.text2, { maxWidth: "30%" }]}>{assignment.submission_type?.trim()}</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Type</Text>
            <Text style={[styles.text2, { maxWidth: "30%" }]}>{assignment.type}</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Topic</Text>
            <Text style={[styles.text2, { maxWidth: "30%" }]}>{assignment.topic}</Text>
          </View>
          <View style={styles.infoContainer1}>
            <Text style={styles.text2}>Faculty Name</Text>
            <Text style={styles.text2}>{assignment.faculty_name}</Text>
          </View>
          {assignment.comments !== "" && (
            <View style={styles.infoContainer2}>
              <Text style={styles.text2}>Comments</Text>
              <Text style={styles.text2}>{assignment.comments}</Text>
            </View>
          )}
          {assignment.teacher_comments !== "" && (
            <View style={styles.infoContainer2}>
              <Text style={styles.text2}>Remarks</Text>
              <Text style={styles.text2}>{assignment.teacher_comments}</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer Buttons */}
      {expanded && (assignment.assignment_download_url !== "" || assignment.assignment_uploaded_by_student !== "") &&
        <View style={styles.footer}>
          {assignment.assignment_download_url !== "" && (
            <Pressable
              style={styles.button}
              onPress={() => Linking.openURL(assignment.assignment_download_url)}
            >
              <Text style={{ fontSize: 12, color: "white", fontWeight: "bold", textAlign: "center" }}>
                Download Assignment
              </Text>
            </Pressable>
          )}
          {assignment.assignment_uploaded_by_student !== "" && (
            <Pressable
              style={styles.button}
              onPress={() => Linking.openURL(assignment.assignment_uploaded_by_student)}
            >
              <Text style={{ fontSize: 12, color: "white", fontWeight: "bold", textAlign: "center" }}>
                Download Student Upload
              </Text>
            </Pressable>
          )}
        </View>}

      <Text style={styles.toggleText}>
        {expanded ? "Click to hide" : "Click to expand"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: WIDTH(95),
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    ...globalStyles.elevationMin,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.disabledBackground,
    marginVertical: 5,
    marginTop: 10,
  },
  infoContainer1: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer2: {
    padding: 5,
    gap: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 15,
    width: WIDTH(40),
    alignItems: 'center',
    justifyContent: 'center'
  },
  text1: {
    color: "grey",
    fontSize: 15,
    fontWeight: 'bold'
  },
  text2: {
    color: "grey",
  },
  toggleText: {
    color: 'gray',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 5
  },
});
