import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PhotoMarkupScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const initialImageUri = route.params?.imageUri;
    const viewShotRef = useRef<any>(null);

    const [paths, setPaths] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [color, setColor] = useState('#ef4444'); // Default red

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath(`M${locationX},${locationY}`);
            },
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath((prev) => `${prev} L${locationX},${locationY}`);
            },
            onPanResponderRelease: () => {
                setPaths((prev) => [...prev, currentPath]);
                setCurrentPath('');
            },
        })
    ).current;

    const handleSave = async () => {
        if (viewShotRef.current) {
            const uri = await viewShotRef.current.capture();
            // Pass back to previous screen
            if (route.params?.onSave) {
                route.params.onSave(uri);
            }
            navigation.goBack();
        }
    };

    const undo = () => {
        setPaths((prev) => prev.slice(0, -1));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mark Up Photo</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Done</Text>
                </TouchableOpacity>
            </View>

            <ViewShot ref={viewShotRef} style={styles.canvasContainer} options={{ format: 'jpg', quality: 0.9 }}>
                <Image source={{ uri: initialImageUri }} style={styles.image} resizeMode="contain" />
                <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        {paths.map((d, index) => (
                            <Path
                                key={index}
                                d={d}
                                stroke={color}
                                strokeWidth={5}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}
                        {currentPath ? (
                            <Path
                                d={currentPath}
                                stroke={color}
                                strokeWidth={5}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ) : null}
                    </Svg>
                </View>
            </ViewShot>

            <View style={styles.toolbar}>
                <TouchableOpacity onPress={undo} style={styles.toolButton}>
                    <Feather name="rotate-ccw" size={24} color="white" />
                    <Text style={styles.toolText}>Undo</Text>
                </TouchableOpacity>

                <View style={styles.colorPicker}>
                    <TouchableOpacity onPress={() => setColor('#ef4444')} style={[styles.colorDot, { backgroundColor: '#ef4444', borderWidth: color === '#ef4444' ? 2 : 0 }]} />
                    <TouchableOpacity onPress={() => setColor('#eab308')} style={[styles.colorDot, { backgroundColor: '#eab308', borderWidth: color === '#eab308' ? 2 : 0 }]} />
                    <TouchableOpacity onPress={() => setColor('#3b82f6')} style={[styles.colorDot, { backgroundColor: '#3b82f6', borderWidth: color === '#3b82f6' ? 2 : 0 }]} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        zIndex: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveText: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    canvasContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#0f172a',
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
    },
    toolButton: {
        alignItems: 'center',
    },
    toolText: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
    colorPicker: {
        flexDirection: 'row',
        gap: 16,
    },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderColor: 'white',
    },
});
