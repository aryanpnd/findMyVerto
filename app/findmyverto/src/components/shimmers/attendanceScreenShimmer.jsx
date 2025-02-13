import { StyleSheet, View } from "react-native"
import { globalStyles } from "../../constants/styles"
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function AttendanceScreenShimmer() {
    return (
        <ShimmerPlaceHolder visible={false} style={[styles.cardContainer]} />
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '90%',
        height: '100%',
        borderRadius: 25,
    },
})