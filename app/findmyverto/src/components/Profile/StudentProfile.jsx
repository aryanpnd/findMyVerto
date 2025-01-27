import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../../constants/colors';
import { API_URL_ROOT } from '../../../context/Auth';

const { height, width } = Dimensions.get('window');
export default function StudentProfile({ student }) {
  // const imageSource = student?.studentPicture ? { uri: `data:image/png;base64,${student?.studentPicture}` } : require("../../../assets/icons/profileAvatar.png");
  const imageSource = student?.studentPicture ? { uri: `${API_URL_ROOT}${student?.studentPicture}` } : require("../../../assets/icons/profileAvatar.png");

  return (
    <View style={styles.container}>

      {/* profile image */}
      <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Image
          source={imageSource}
          style={{ height: height * 0.15, width: height * 0.15, borderRadius: height * 0.15 / 2,objectFit:"fill" }}
          transition={1000}
        />
      </View>

      {/* name */}
      <View style={{ alignItems: "center", width: "100%", gap: 10 }}>
        <Text style={[styles.textL, { fontWeight: "500" }]}>{student?.studentName}</Text>
        <Text style={[styles.textL, { color: "grey" }]}>{student?.reg_no}</Text>
      </View>

      <View style={styles.otherInfo}>
        <View style={styles.otherInfoSub}>
          <View style={styles.otherInfoSub2}>
            <Text style={styles.textM}>Section</Text>
            <Text>{student?.section}</Text>
          </View>

          <View style={styles.otherInfoSub2}>
            <Text style={[styles.textM, { textAlign: "right" }]}>Roll No</Text>
            <Text style={{ textAlign: "right" }}>{student?.rollNumber?.split(student?.section)[1]}</Text>
          </View>
        </View>

        {/* <View style={styles.otherInfoSub}>
          <View style={styles.otherInfoSub2}>
            <Text style={styles.textM}>Roll no.</Text>
            <Text>{student?.rollNo}</Text>
          </View>

          <View style={styles.otherInfoSub2}>
            <Text style={[styles.textM, { textAlign: "right" }]}>Term</Text>
            <Text style={{ textAlign: "right" }}>{student?.term}</Text>
          </View>
        </View> */}

        <View style={{ alignItems: "center" }}>
          <Text style={styles.textM}>Program</Text>
          <Text>{student?.program}</Text>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor:"red",
    width: "100%",
    alignItems: "center",
  },
  otherInfo: {
    width: "90%",
    marginTop: height * 0.02,
    gap: 20,
    padding: width * 0.05,
    borderRadius: 20,
    backgroundColor: colors.whiteLight
  },
  otherInfoSub: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otherInfoSub2: {
    width: "40%"
  },

  textL: {
    fontSize: 20,
    color: colors.lightDark,
    textAlign: "center"
  },
  textM: {
    fontSize: 18,
    color: "grey",
  }
})