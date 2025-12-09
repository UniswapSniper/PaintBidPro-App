import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BidCardProps {
    projectName: string;
    address: string;
    price: number;
    status: 'draft' | 'generated' | 'sent' | 'accepted';
    date: string;
    onPress: () => void;
}

export default function BidCard({ projectName, address, price, status, date, onPress }: BidCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return '#22c55e';
            case 'sent': return '#3b82f6';
            case 'generated': return '#a855f7';
            default: return '#64748b';
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Feather name="home" size={20} color="#cbd5e1" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.projectName}>{projectName || 'Untitled Project'}</Text>
                    <Text style={styles.address} numberOfLines={1}>{address || 'No address provided'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
                <Text style={styles.price}>
                    {price ? `$${price.toLocaleString()}` : 'Pending'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    projectName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    address: {
        color: '#94a3b8',
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        color: '#64748b',
        fontSize: 12,
    },
    price: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});
