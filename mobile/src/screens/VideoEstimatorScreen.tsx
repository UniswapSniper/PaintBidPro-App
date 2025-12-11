import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import VoiceAI, { PROMPTS } from '../utils/VoiceAI';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Scanning HUD overlay
const ScanningHUD = ({ isActive }: { isActive: boolean }) => (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
            <RadialGradient id="scanGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <Stop offset="70%" stopColor="#3b82f6" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </RadialGradient>
        </Defs>
        {/* Corner brackets */}
        <Line x1="40" y1="120" x2="80" y2="120" stroke="rgba(59,130,246,0.8)" strokeWidth="3" />
        <Line x1="40" y1="120" x2="40" y2="160" stroke="rgba(59,130,246,0.8)" strokeWidth="3" />

        <Line x1={width - 40} y1="120" x2={width - 80} y2="120" stroke="rgba(59,130,246,0.8)" strokeWidth="3" />
        <Line x1={width - 40} y1="120" x2={width - 40} y2="160" stroke="rgba(59,130,246,0.8)" strokeWidth="3" />

        <Line x1="40" y1={height - 220} x2="80" y2={height - 220} stroke="rgba(59,130,246,0.8)" strokeWidth="3" />
        <Line x1="40" y1={height - 220} x2="40" y2={height - 260} stroke="rgba(59,130,246,0.8)" strokeWidth="3" />

        <Line x1={width - 40} y1={height - 220} x2={width - 80} y2={height - 220} stroke="rgba(59,130,246,0.8)" strokeWidth="3" />
        <Line x1={width - 40} y1={height - 220} x2={width - 40} y2={height - 260} stroke="rgba(59,130,246,0.8)" strokeWidth="3" />

        {isActive && (
            <Circle cx={width / 2} cy={height / 2 - 50} r="100" fill="url(#scanGlow)" />
        )}
    </Svg>
);

// Waveform visualization
const VoiceWaveform = ({ isActive }: { isActive: boolean }) => {
    const bars = [0.3, 0.6, 0.9, 0.7, 0.4, 0.8, 0.5, 0.7, 0.3];

    return (
        <View style={styles.waveformContainer}>
            {bars.map((height, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.waveformBar,
                        {
                            height: isActive ? height * 30 : 4,
                            backgroundColor: isActive ? '#60a5fa' : '#475569',
                        }
                    ]}
                />
            ))}
        </View>
    );
};

const STEPS = [
    { id: 'greeting', duration: 8000 },
    { id: 'walls', duration: 12000 },
    { id: 'windows', duration: 8000 },
    { id: 'ceiling', duration: 6000 },
    { id: 'complete', duration: 4000 },
];

export default function VideoEstimatorScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const [aiMessage, setAiMessage] = useState("Tap the record button to start scanning");
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            VoiceAI.cleanup();
        };
    }, []);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.permissionCard}>
                    <Feather name="camera" size={48} color="#60a5fa" />
                    <Text style={styles.permissionTitle}>Camera Access Needed</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to scan the room for your estimate.
                    </Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                        <Text style={styles.permissionButtonText}>Enable Camera</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const startScan = async () => {
        setIsRecording(true);
        setCurrentStep(0);

        // Start camera recording
        if (cameraRef.current) {
            cameraRef.current.recordAsync({ maxDuration: 60 }).then((data) => {
                if (data) {
                    handleScanComplete(data.uri);
                }
            });
        }

        // Run through steps
        runStep(0);
    };

    const runStep = async (stepIndex: number) => {
        if (stepIndex >= STEPS.length) {
            stopScan();
            return;
        }

        const step = STEPS[stepIndex];
        setCurrentStep(stepIndex);

        const message = VoiceAI.getStepPrompt(step.id as any);
        setAiMessage(message);
        setIsSpeaking(true);

        await VoiceAI.speak(message);
        setIsSpeaking(false);

        // Wait for step duration then move to next
        setTimeout(() => {
            if (isRecording) {
                runStep(stepIndex + 1);
            }
        }, step.duration);
    };

    const stopScan = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
        }
        setIsRecording(false);
        VoiceAI.stop();
    };

    const handleScanComplete = async (videoUri: string) => {
        setAiMessage("Analyzing your scan...");

        // Simulate analysis
        setTimeout(() => {
            Alert.alert(
                "Scan Complete! 🎉",
                "I analyzed your room and found:\n\n• 4 walls (approx 320 sq ft)\n• 2 windows needing trim work\n• 1 door frame\n• Minor ceiling texture repair\n\nReady to generate your estimate?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Generate Estimate",
                        onPress: () => {
                            if (route.params?.onAnalysisComplete) {
                                route.params.onAnalysisComplete({
                                    summary: "AI Room Analysis:\n- 4 walls, standard 8ft height\n- 2 windows with wood trim\n- 1 door frame\n- Ceiling needs minor texture repair",
                                    suggestedItems: [
                                        { description: "Wall Painting (Standard)", quantity: 320, unit_price: 2.50, total: 800 },
                                        { description: "Window Trim (x2)", quantity: 2, unit_price: 45.00, total: 90 },
                                        { description: "Door Frame", quantity: 1, unit_price: 35.00, total: 35 },
                                        { description: "Ceiling Texture Repair", quantity: 1, unit_price: 75.00, total: 75 },
                                    ]
                                });
                            }
                            navigation.goBack();
                        }
                    }
                ]
            );
        }, 2000);
    };

    // Handle "Ask AI" button
    const handleAskAI = async () => {
        if (isListening) {
            // Stop listening and process
            setIsListening(false);
            const transcription = await VoiceAI.stopListening();

            if (transcription) {
                setAiMessage("Thinking...");
                const response = await VoiceAI.askAI(transcription);
                setAiMessage(response);
                setIsSpeaking(true);
                await VoiceAI.speak(response);
                setIsSpeaking(false);
            } else {
                setAiMessage("I didn't catch that. Try holding the mic button and speaking clearly.");
            }
        } else {
            // Start listening
            setIsListening(true);
            setAiMessage("I'm listening...");
            await VoiceAI.startListening();
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                mode="video"
                ref={cameraRef}
            >
                <ScanningHUD isActive={isRecording} />

                <View style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                stopScan();
                                navigation.goBack();
                            }}
                            style={styles.closeButton}
                        >
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>

                        {isRecording && (
                            <View style={styles.recordingBadge}>
                                <View style={styles.recordingDot} />
                                <Text style={styles.recordingText}>SCANNING</Text>
                            </View>
                        )}
                    </View>

                    {/* AI Message Box */}
                    <View style={styles.aiMessageContainer}>
                        <LinearGradient
                            colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']}
                            style={styles.aiMessageBox}
                        >
                            <View style={styles.aiHeader}>
                                <View style={styles.aiAvatar}>
                                    <Feather name="cpu" size={20} color="#60a5fa" />
                                </View>
                                <Text style={styles.aiLabel}>AI Assistant</Text>
                                <VoiceWaveform isActive={isSpeaking} />
                            </View>
                            <Text style={styles.aiMessageText}>{aiMessage}</Text>
                        </LinearGradient>
                    </View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        {/* Ask AI Button */}
                        <TouchableOpacity
                            style={[styles.micButton, isListening && styles.micButtonActive]}
                            onPress={handleAskAI}
                        >
                            <Feather
                                name={isListening ? "mic" : "mic-off"}
                                size={24}
                                color={isListening ? "#22c55e" : "#94a3b8"}
                            />
                        </TouchableOpacity>

                        {/* Main Record Button */}
                        {!isRecording ? (
                            <TouchableOpacity onPress={startScan} style={styles.recordButton}>
                                <LinearGradient
                                    colors={['#3b82f6', '#2563eb']}
                                    style={styles.recordButtonInner}
                                >
                                    <Feather name="video" size={32} color="white" />
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={stopScan} style={styles.stopButton}>
                                <View style={styles.stopButtonInner} />
                            </TouchableOpacity>
                        )}

                        {/* Placeholder for symmetry */}
                        <View style={styles.micButton} />
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a'
    },
    camera: {
        flex: 1
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        paddingTop: 60,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        marginRight: 8,
    },
    recordingText: {
        color: '#ef4444',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1,
    },
    // AI Message
    aiMessageContainer: {
        position: 'absolute',
        bottom: 200,
        left: 20,
        right: 20,
    },
    aiMessageBox: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.3)',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    aiLabel: {
        color: '#60a5fa',
        fontSize: 12,
        fontWeight: '700',
        flex: 1,
    },
    aiMessageText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    waveformBar: {
        width: 3,
        borderRadius: 2,
    },
    // Controls
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
        gap: 24,
    },
    micButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(71, 85, 105, 0.5)',
    },
    micButtonActive: {
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        padding: 4,
    },
    recordButtonInner: {
        flex: 1,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stopButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stopButtonInner: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#ef4444'
    },
    // Permission screen
    permissionCard: {
        margin: 20,
        padding: 32,
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(71, 85, 105, 0.5)',
    },
    permissionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    permissionText: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    permissionButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
