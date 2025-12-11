import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StatsCardProps {
    title: string;
    value: string;
    icon: keyof typeof Feather.glyphMap;
    colors: string[];
    trend?: string;
    trendUp?: boolean;
}

export default function StatsCard({ title, value, icon, colors, trend, trendUp }: StatsCardProps) {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Feather name={icon} size={20} color="white" />
                </View>
                {trend && (
                    <View style={styles.trendContainer}>
                        <Feather
                            name={trendUp ? "trending-up" : "trending-down"}
                            size={14}
                            color={trendUp ? "#4ade80" : "#f87171"}
                        />
                        <Text style={[styles.trendText, { color: trendUp ? "#4ade80" : "#f87171" }]}>
                            {trend}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        padding: 16,
        borderRadius: 20,
        marginRight: 16,
        justifyContent: 'space-between',
        height: 140,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    trendText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    content: {
        marginTop: 12,
    },
    value: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    }
});
