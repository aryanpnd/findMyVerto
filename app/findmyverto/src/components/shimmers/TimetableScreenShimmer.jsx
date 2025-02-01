import { StyleSheet, View } from "react-native"
import { globalStyles, HEIGHT, WIDTH } from "../../constants/styles"
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient); // Create shimmer placeholder

export default function TimetableScreenShimmer({ count }) {
    return (
        <View style={styles.cardContainer}>
            {
                Array(count).fill(0).map((_, index) => (
                    // <TimetableScreenShimmer key={index} />
                    <ShimmerPlaceHolder key={index} visible={false} 
                    width={WIDTH(95)} height={HEIGHT(10)} 
                    style={{borderRadius:25}}
                    contentStyle={styles.cardContainer} />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height:"90%",
        width: '100%',
        gap:10,
        paddingHorizontal:WIDTH(5),
        paddingVertical:HEIGHT(2),
        alignItems:"center"
    },
    card: {
    },
})