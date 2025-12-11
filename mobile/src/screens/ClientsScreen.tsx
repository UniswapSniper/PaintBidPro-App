import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../lib/api';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    created_at: string;
}

export default function ClientsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const user = route.params?.user;

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [addingLoading, setAddingLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    // New Client Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const fetchClients = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await api.getClients(user.id);
        if (error) {
            console.error(error);
        } else {
            setClients(data || []);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchClients();
        }, [user])
    );

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddClient = async () => {
        if (!name) {
            Alert.alert('Required', 'Please enter a client name');
            return;
        }

        setAddingLoading(true);
        const { data, error } = await api.createClient({
            userId: user.id,
            name,
            email,
            phone,
            address,
            notes: ''
        });

        setAddingLoading(false);

        if (error) {
            Alert.alert('Error', 'Failed to add client');
        } else {
            setClients([data, ...clients]);
            setIsAdding(false);
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
        }
    };

    const renderItem = ({ item }: { item: Client }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.clientName}>{item.name}</Text>
                    {item.email ? <Text style={styles.clientSubtext}>{item.email}</Text> : null}
                    {item.phone ? <Text style={styles.clientSubtext}>{item.phone}</Text> : null}
                </View>
                <TouchableOpacity style={styles.arrowButton}>
                    <Feather name="chevron-right" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
            {item.address ? (
                <View style={styles.addressContainer}>
                    <Feather name="map-pin" size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={styles.addressText}>{item.address}</Text>
                </View>
            ) : null}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Clients</Text>
                <TouchableOpacity onPress={() => setIsAdding(!isAdding)} style={styles.addButton}>
                    <Feather name={isAdding ? "x" : "plus"} size={24} color="white" />
                </TouchableOpacity>
            </View>

            {!isAdding && clients.length > 0 && (
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search clients..."
                        placeholderTextColor="#64748b"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            )}

            {isAdding && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Add New Client</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Client Name"
                        placeholderTextColor="#64748b"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email (Optional)"
                        placeholderTextColor="#64748b"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone (Optional)"
                        placeholderTextColor="#64748b"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleAddClient}
                        disabled={addingLoading}
                    >
                        {addingLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Save Client</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredClients}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchClients}
                ListEmptyComponent={
                    !loading && !isAdding ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No clients yet.</Text>
                            <Text style={styles.emptySubtext}>Tap + to add your first customer.</Text>
                        </View>
                    ) : null
                }
            />
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
        padding: 4,
    },
    addButton: {
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        margin: 20,
        marginBottom: 0,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        paddingVertical: 12,
        fontSize: 16,
    },
    list: {
        padding: 20,
        gap: 16,
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardContent: {
        flex: 1,
    },
    clientName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    clientSubtext: {
        color: '#94a3b8',
        fontSize: 14,
    },
    arrowButton: {
        padding: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    addressText: {
        color: '#cbd5e1',
        fontSize: 14,
    },
    formContainer: {
        padding: 20,
        backgroundColor: '#0f172a',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        gap: 12,
    },
    formTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 14,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#94a3b8',
        fontSize: 14,
    },
});
