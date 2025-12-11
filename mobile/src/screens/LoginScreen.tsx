import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import { api } from '../lib/api';
// import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paint brush logo component
const PaintBrushLogo = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 10-3-3z"
            fill="#fff"
        />
        <Path
            d="M9 8L4.42 12.58a4 4 0 001.8 6.68 5.43 5.43 0 002.6-.75L13 15"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);

// Decorative paint splash component
const PaintSplash = ({ color }: { color: string }) => (
    <Svg width={120} height={120} viewBox="0 0 120 120">
        <Defs>
            <RadialGradient id={`grad-${color}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
        </Defs>
        <Circle cx="60" cy="60" r="60" fill={`url(#grad-${color})`} />
    </Svg>
);

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Animation values using React Native's built-in Animated API
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const formOpacity = useRef(new Animated.Value(0)).current;
    const formTranslateY = useRef(new Animated.Value(30)).current;
    const splash1Opacity = useRef(new Animated.Value(0.3)).current;
    const splash2Opacity = useRef(new Animated.Value(0.2)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Logo entrance animation
        Animated.spring(logoScale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        // Form entrance animation
        Animated.parallel([
            Animated.timing(formOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(formTranslateY, {
                toValue: 0,
                friction: 10,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulsing animation for splashes
        const pulseAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(splash1Opacity, {
                        toValue: 0.5,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(splash1Opacity, {
                        toValue: 0.3,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(splash2Opacity, {
                        toValue: 0.4,
                        duration: 2500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(splash2Opacity, {
                        toValue: 0.2,
                        duration: 2500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        pulseAnimation();
    }, []);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.96,
            friction: 10,
            tension: 200,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 10,
            tension: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleLogin = async () => {
        setLoading(true);

        const { user, error } = await api.login(email, password);

        setLoading(false);

        if (error) {
            Alert.alert("Login Error", error.message);
        } else {
            // Pass user object to Home screen
            navigation.replace('Home', { user });
        }
    };

    return (
        <View style={styles.container}>
            {/* Gradient background layers */}
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />

            {/* Decorative paint splashes */}
            <Animated.View style={[styles.splash1, { opacity: splash1Opacity }]}>
                <PaintSplash color="#3b82f6" />
            </Animated.View>
            <Animated.View style={[styles.splash2, { opacity: splash2Opacity }]}>
                <PaintSplash color="#8b5cf6" />
            </Animated.View>
            <Animated.View style={[styles.splash3, { opacity: splash1Opacity }]}>
                <PaintSplash color="#06b6d4" />
            </Animated.View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    {/* Header with animated logo */}
                    <View style={styles.header}>
                        <Animated.View style={[
                            styles.logoContainer,
                            { transform: [{ scale: logoScale }] }
                        ]}>
                            <View style={styles.logoInner}>
                                <PaintBrushLogo />
                            </View>
                            <View style={styles.logoGlow} />
                        </Animated.View>
                        <Text style={styles.title}>PaintBidPro</Text>
                        <Text style={styles.subtitle}>Professional painting estimates made easy</Text>
                    </View>

                    {/* Form with glassmorphism */}
                    <Animated.View style={[
                        styles.formCard,
                        {
                            opacity: formOpacity,
                            transform: [{ translateY: formTranslateY }]
                        }
                    ]}>
                        <View style={styles.formInner}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={[
                                    styles.inputContainer,
                                    emailFocused && styles.inputContainerFocused
                                ]}>
                                    <View style={styles.iconContainer}>
                                        <Feather
                                            name="mail"
                                            color={emailFocused ? "#3b82f6" : "#64748b"}
                                            size={20}
                                        />
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#475569"
                                        value={email}
                                        onChangeText={setEmail}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={[
                                    styles.inputContainer,
                                    passwordFocused && styles.inputContainerFocused
                                ]}>
                                    <View style={styles.iconContainer}>
                                        <Feather
                                            name="lock"
                                            color={passwordFocused ? "#3b82f6" : "#64748b"}
                                            size={20}
                                        />
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#475569"
                                        value={password}
                                        onChangeText={setPassword}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    style={styles.loginButton}
                                    activeOpacity={1}
                                    disabled={loading}
                                >
                                    <View style={styles.buttonGradient}>
                                        <Text style={styles.loginButtonText}>
                                            {loading ? 'Signing in...' : 'Sign In'}
                                        </Text>
                                        {!loading && (
                                            <View style={styles.arrowContainer}>
                                                <Feather name="arrow-right" color="white" size={20} />
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View style={[
                        styles.footer,
                        {
                            opacity: formOpacity,
                            transform: [{ translateY: formTranslateY }]
                        }
                    ]}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupText}>Create Account</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    gradientLayer1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        backgroundColor: '#1e3a8a',
        borderRadius: 150,
        opacity: 0.3,
        transform: [{ scale: 1.5 }],
    },
    gradientLayer2: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        width: 250,
        height: 250,
        backgroundColor: '#7c3aed',
        borderRadius: 125,
        opacity: 0.2,
        transform: [{ scale: 1.3 }],
    },
    gradientLayer3: {
        position: 'absolute',
        top: height * 0.4,
        right: -80,
        width: 200,
        height: 200,
        backgroundColor: '#0891b2',
        borderRadius: 100,
        opacity: 0.15,
    },
    splash1: {
        position: 'absolute',
        top: 80,
        left: 20,
        width: 120,
        height: 120,
    },
    splash2: {
        position: 'absolute',
        top: 200,
        right: -20,
        width: 120,
        height: 120,
    },
    splash3: {
        position: 'absolute',
        bottom: 150,
        left: -30,
        width: 120,
        height: 120,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoInner: {
        height: 80,
        width: 80,
        backgroundColor: '#2563eb',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    logoGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: '#3b82f6',
        borderRadius: 50,
        opacity: 0.2,
        transform: [{ scale: 1.2 }],
        zIndex: -1,
    },
    title: {
        color: 'white',
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94a3b8',
        marginTop: 8,
        fontSize: 16,
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
        overflow: 'hidden',
    },
    formInner: {
        padding: 24,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#e2e8f0',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60, // Fixed height for easier tapping
    },
    inputContainerFocused: {
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(30, 41, 59, 1)',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        height: '100%', // Fill the container
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginTop: -8,
    },
    forgotPasswordText: {
        color: '#60a5fa',
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    buttonGradient: {
        backgroundColor: '#2563eb',
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    arrowContainer: {
        marginLeft: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 4,
    },
    footer: {
        marginTop: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 15,
    },
    signupText: {
        color: '#60a5fa',
        fontWeight: '700',
        fontSize: 15,
    },
});
