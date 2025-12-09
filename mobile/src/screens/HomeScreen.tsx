import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BidCard from '../components/BidCard';

interface Bid {
    id: string;
    project_name: string;
    address: string;
    search_address: string;
    estimated_cost: number;
    status: 'draft' | 'generated' | 'sent' | 'accepted';
    created_at: string;
}

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    const fetchBids = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserEmail(user.email || '');
            const { data, error } = await supabase
                .from('bids')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                Alert.alert('Error fetching bids', error.message);
            } else {
                setBids(data as Bid[]);
            }
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchBids();
        }, [])
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigation.replace('Login');
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Feather name="clipboard" size={48} color="#334155" />
            </View>
            <Text style={styles.emptyTitle}>No bids yet</Text>
            <Text style={styles.emptySubtitle}>
                Create your first painting bid to get started.
            </Text>
            <TouchableOpacity
                style={styles.createButtonEmpty}
                onPress={() => navigation.navigate('CreateBid')}
            >
                <Text style={styles.createButtonText}>Create New Bid</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.email}>{userEmail}</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                    <Feather name="log-out" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={bids}
                renderItem={({ item }) => (
                    <BidCard
                        projectName={item.project_name}
                        address={item.address}
                        price={item.estimated_cost}
                        status={item.status}
                        date={item.created_at}
                        onPress={() => console.log('View Bid', item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    bids.length === 0 && { flex: 1 }
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchBids}
                        tintColor="#fff"
                        titleColor="#fff"
                    />
                }
                ListEmptyComponent={!loading ? renderEmptyState : null}
            />

            {bids.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('CreateBid')}
                >
                    <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    greeting: {
        color: '#94a3b8',
        fontSize: 14,
    },
    email: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signOutButton: {
        padding: 8,
        backgroundColor: '#1e293b',
        borderRadius: 8,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#1e293b',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: 240,
        marginBottom: 32,
    },
    createButtonEmpty: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        backgroundColor: '#2563eb',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
