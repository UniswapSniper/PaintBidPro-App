import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../lib/api';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const user = route.params?.user;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [companyName, setCompanyName] = useState('');
    const [defaultRate, setDefaultRate] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await api.getProfile(user.id);
        if (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load profile');
        } else if (data) {
            setCompanyName(data.company_name || '');
            setDefaultRate(data.default_rate ? data.default_rate.toString() : '');
            setLogoUrl(data.logo_url || '');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { data, error } = await api.updateProfile({
            userId: user.id,
            company_name: companyName,
            default_rate: parseFloat(defaultRate) || 0,
            logo_url: logoUrl
        });
        setSaving(false);

        if (error) {
            Alert.alert('Error', 'Failed to update profile');
        } else {
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Company Porfile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {companyName ? companyName.charAt(0).toUpperCase() : 'C'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.changeAvatarButton}>
                        <Text style={styles.changeAvatarText}>Change Logo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                        style={styles.input}
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholder="Enter your company name"
                        placeholderTextColor="#64748b"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Default Hourly/SqFt Rate ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={defaultRate}
                        onChangeText={setDefaultRate}
                        placeholder="e.g. 2.50"
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                    />
                    <Text style={styles.helperText}>Used for auto-calculating estimates.</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Account Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user?.email}
                        editable={false}
                    />
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
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
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3b82f6',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    changeAvatarButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#1e293b',
        borderRadius: 20,
    },
    changeAvatarText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    disabledInput: {
        opacity: 0.6,
    },
    helperText: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 6,
    },
    saveButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
