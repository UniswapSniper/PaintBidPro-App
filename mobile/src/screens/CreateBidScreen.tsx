import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function CreateBidScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Form State
    const [projectName, setProjectName] = useState('');
    const [address, setAddress] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    // Constants (Mock values for MVP)
    const COST_PER_SQ_FT = 2.50; // $2.50 per sq ft of wall area

    const calculateEstimate = () => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        const h = parseFloat(height);

        if (isNaN(l) || isNaN(w) || isNaN(h)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for dimensions.');
            return null;
        }

        // Simple Wall Area Calculation: Perimeter * Height
        const perimeter = (l + w) * 2;
        const wallArea = perimeter * h;
        const totalCost = wallArea * COST_PER_SQ_FT;

        return {
            wallArea,
            totalCost
        };
    };

    const handleSaveBid = async () => {
        if (!projectName || !length || !width || !height) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        const estimate = calculateEstimate();
        if (!estimate) return;

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase
                .from('bids')
                .insert({
                    user_id: user.id,
                    project_name: projectName,
                    address: address,
                    room_dimensions: {
                        length: parseFloat(length),
                        width: parseFloat(width),
                        height: parseFloat(height)
                    },
                    total_sq_ft: estimate.wallArea,
                    estimated_cost: estimate.totalCost,
                    status: 'generated'
                });

            if (error) throw error;

            Alert.alert('Success', 'Bid created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Bid</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>Project Details</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Project Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Living Room Repaint"
                        placeholderTextColor="#64748b"
                        value={projectName}
                        onChangeText={setProjectName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="123 Main St"
                        placeholderTextColor="#64748b"
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Room Dimensions (ft)</Text>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Length</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={length}
                            onChangeText={setLength}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 8 }]}>
                        <Text style={styles.label}>Width</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={width}
                            onChangeText={setWidth}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Height</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={height}
                            onChangeText={setHeight}
                        />
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Feather name="info" size={16} color="#64748b" style={{ marginTop: 2, marginRight: 8 }} />
                    <Text style={styles.infoText}>
                        Estimate is based on wall area calculation. Simple formula: (L+W) * 2 * H * Rate.
                    </Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSaveBid}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Calculate & Save Bid</Text>
                    )}
                </TouchableOpacity>
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
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    divider: {
        height: 1,
        backgroundColor: '#1e293b',
        marginVertical: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    infoText: {
        color: '#94a3b8',
        fontSize: 12,
        flex: 1,
        lineHeight: 18,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
        backgroundColor: '#020617',
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
