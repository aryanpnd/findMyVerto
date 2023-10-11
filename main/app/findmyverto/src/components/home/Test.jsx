import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { width } = Dimensions.get('window');

const headers = ['header1', 'header header 2', 'header3', 'header header4', 'header5', 'header header6', 'header7', 'header header8', 'header9', 'header10']

let animationActive = true;
let animationActiveRef;
export default function Test() {
    const [active, setActive] = useState(0)
    const headerScrollView = useRef();
    const itemScrollView = useRef();
    useEffect(() => {
        headerScrollView.current.scrollToIndex({ index: active, viewPosition: 0.5 })
    }, [active])
    const onPressHeader = (index) => {
        if (animationActiveRef) { clearTimeout(animationActiveRef) }
        if (active != index) {
            animationActive = false
            animationActiveRef = setTimeout(() => {
                animationActive = true
            }, 400);
            itemScrollView.current.scrollToIndex({ index })
            setActive(index);
        }
    }
    const onScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        let newIndex = Math.floor((x / width) + 0.5)
        if (active != newIndex && animationActive) {
            setActive(newIndex)
        }
    }
    const onMomentumScrollEnd = () => {
        animationActive = true;
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={headers}
                ref={headerScrollView}
                keyExtractor={(item) => item}
                horizontal
                style={styles.headerScroll}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View>
                        <TouchableOpacity
                            onPress={() => onPressHeader(index)}
                            key={item}
                            style={[styles.headerItem, { backgroundColor: active == index ? '#b6d7fc' : '#82bcff' }]}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                        {/* {active == index && <View style={styles.headerBar} />} */}
                    </View>
                )}
            />
            <FlatList
                data={headers}
                ref={itemScrollView}
                keyExtractor={(item) => item}
                horizontal
                pagingEnabled
                decelerationRate='fast'
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item, index }) => (
                    <View key={item} style={styles.mainItem}>
                        <Text>Animation happens while scrolling itself</Text>
                        <Text>card {index + 1}</Text>
                    </View>
                )}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerScroll: {
        flexGrow: 0,
    },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    mainItem: {
        width: width,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerBar: {
        height: 2,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#000',
        // position: 'absolute',
        bottom: 0
    }
})