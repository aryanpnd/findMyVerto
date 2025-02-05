import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../constants/colors';
import { API_URL_ROOT } from '../../../context/Auth';
import SyncData from '../miscellaneous/SyncData';
import formatTimeAgo from '../../../utils/helperFunctions/dateFormatter';
import ImageViewer from '../miscellaneous/ImageViewer';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { HEIGHT, WIDTH } from '../../constants/styles';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function StudentProfile({ student, loading }) {
  const [fullscreenImage, setFullscreenImage] = useState(false)
  const imageSource = student?.studentPicture
    ? { uri: `${API_URL_ROOT}${student?.studentPicture}` }
    : require("../../../assets/icons/profileAvatar.png");
  const onImageError = () => {
    imageSource = require("../../../assets/icons/profileAvatar.png");
  }

  return (
    loading ?
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
          <ShimmerPlaceHolder visible={false} style={{ height: HEIGHT(15), width: HEIGHT(15), borderRadius: HEIGHT(15) / 2 }} />
        </View>
        <View style={{ alignItems: "center", width: "100%", gap: 10, marginTop: 10 }}>
          <ShimmerPlaceHolder visible={false} style={{ height: 30, width: "80%", borderRadius: 10 }} />
          <ShimmerPlaceHolder visible={false} style={{ height: 30, width: "80%", borderRadius: 10 }} />
        </View>
        <ShimmerPlaceHolder visible={false} style={{height:HEIGHT(25), width:"80%",marginTop:20,
    borderRadius: 20,}}/>
      </View>
      :
      <View style={styles.container}>
        <ImageViewer image={imageSource} visible={fullscreenImage} setVisible={setFullscreenImage} />
        {/* profile image */}
        <Pressable onPress={() => setFullscreenImage(true)} style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
          <Image
            source={imageSource}
            style={{height: HEIGHT(15), width: HEIGHT(15), borderRadius: HEIGHT(15) / 2 , objectFit: "fill" }}
            transition={1000}
            onError={onImageError}
          />
        </Pressable>

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
    marginTop: HEIGHT(2),
    gap: 20,
    padding: WIDTH(5),
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