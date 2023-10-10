import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width / 3) * 2;
const gap = (width - itemWidth) / 4;
export default function Test() {
    return (
        <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            snapToInterval={itemWidth + gap}>
            {[1, 2, 3, 4, 5].map(x => (
                <View key={x} style={styles.item} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingLeft: gap * 2,
        paddingRight: gap,
        alignItems: 'center',
    },
    item: {
        height: itemWidth,
        width: itemWidth,
        backgroundColor: 'darkred',
        marginRight: gap,
        borderRadius: 10,
    },
});