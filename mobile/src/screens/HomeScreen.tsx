import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl, Image, StatusBar, Animated } from 'react-native';
import { api } from '../lib/api';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
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

// AI-themed decorative element
const AIGlowOrb = ({ size = 150, color = '#3b82f6' }) => (
    <Svg height={size} width={size} viewBox="0 0 100 100">
        <Defs>
            <RadialGradient id={`glow-${color}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <Stop offset="70%" stopColor={color} stopOpacity="0.1" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#glow-${color})`} />
        <Circle cx="50" cy="50" r="15" fill={color} fillOpacity="0.3" />
        <Circle cx="50" cy="50" r="5" fill={color} fillOpacity="0.6" />
    </Svg>
);

// Stats Card with AI theme
const StatsCard = ({ title, value, icon, gradientColors, subtitle }: any) => (
    <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
    >
        <View style={styles.statsCardContent}>
            <View style={styles.statsIconContainer}>
                <Feather name={icon} size={20} color="white" />
            </View>
            <Text style={styles.statsValue}>{value}</Text>
            <Text style={styles.statsTitle}>{title}</Text>
            {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
        </View>
        {/* Decorative circuit lines */}
        <View style={styles.circuitDecor}>
            <View style={[styles.circuitLine, { width: 30 }]} />
            <View style={[styles.circuitDot]} />
        </View>
    </LinearGradient>
);

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const user = route.params?.user;

    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(user?.email || 'Guest');

    // Stats State
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [activeJobs, setActiveJobs] = useState(0);
    const [winRate, setWinRate] = useState(0);

    const fetchBids = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await api.getBids(user.id);

        if (error) {
            console.error(error);
        } else {
            const fetchedBids = data || [];
            setBids(fetchedBids);
            calculateStats(fetchedBids);
        }
        setLoading(false);
    };

    const calculateStats = (data: Bid[]) => {
        const accepted = data.filter(b => b.status === 'accepted');
        const revenue = accepted.reduce((acc, bid) => acc + (bid.estimated_cost || 0), 0);
        const active = data.filter(b => b.status === 'sent' || b.status === 'generated').length;
        const sent = data.filter(b => b.status === 'sent' || b.status === 'accepted').length;
        const rate = sent > 0 ? Math.round((accepted.length / sent) * 100) : 0;

        setTotalRevenue(revenue);
        setActiveJobs(active);
        setWinRate(rate);
    };

    useFocusEffect(
        useCallback(() => {
            fetchBids();
        }, [user])
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const renderHeader = () => (
        <View>
            {/* AI Glow Orbs - Background */}
            <View style={styles.orbContainer}>
                <View style={styles.orb1}><AIGlowOrb size={200} color="#3b82f6" /></View>
                <View style={styles.orb2}><AIGlowOrb size={150} color="#8b5cf6" /></View>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.username}>{userEmail.split('@')[0]}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Feather name="bell" size={20} color="#94a3b8" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { user })}>
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            style={styles.avatarGradient}
                        >
                            <Text style={styles.avatarText}>
                                {userEmail.charAt(0).toUpperCase()}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* AI Assistant Banner */}
            <TouchableOpacity
                style={styles.aiBanner}
                onPress={() => navigation.navigate('VideoEstimator')}
            >
                <LinearGradient
                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(139, 92, 246, 0.15)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.aiBannerGradient}
                >
                    <View style={styles.aiBannerContent}>
                        <View style={styles.aiIconContainer}>
                            <Feather name="cpu" size={24} color="#60a5fa" />
                        </View>
                        <View style={styles.aiBannerText}>
                            <Text style={styles.aiBannerTitle}>AI Room Scanner Ready</Text>
                            <Text style={styles.aiBannerSubtitle}>Tap to start voice-guided estimation</Text>
                        </View>
                    </View>
                    <View style={styles.aiBannerArrow}>
                        <Feather name="chevron-right" size={24} color="#60a5fa" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Stats Carousel */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.statsScroll}
                contentContainerStyle={styles.statsContainer}
            >
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon="dollar-sign"
                    gradientColors={['#0ea5e9', '#0284c7']}
                    subtitle="All accepted bids"
                />
                <StatsCard
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon="trending-up"
                    gradientColors={['#8b5cf6', '#7c3aed']}
                    subtitle="Conversion rate"
                />
                <StatsCard
                    title="Active Jobs"
                    value={activeJobs.toString()}
                    icon="briefcase"
                    gradientColors={['#f59e0b', '#d97706']}
                    subtitle="Pending & sent"
                />
                <StatsCard
                    title="Total Bids"
                    value={bids.length.toString()}
                    icon="file-text"
                    gradientColors={['#10b981', '#059669']}
                    subtitle="All time"
                />
            </ScrollView>

            {/* Quick Actions */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <View style={styles.actionGrid}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('CreateBid', { userId: user.id })}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.actionIconGradient}
                    >
                        <Feather name="plus" size={28} color="white" />
                    </LinearGradient>
                    <Text style={styles.actionText}>New Estimate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('VideoEstimator')}
                >
                    <LinearGradient
                        colors={['#ec4899', '#db2777']}
                        style={styles.actionIconGradient}
                    >
                        <Feather name="video" size={28} color="white" />
                    </LinearGradient>
                    <Text style={styles.actionText}>AI Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Clients', { user })}
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.actionIconGradient}
                    >
                        <Feather name="users" size={28} color="white" />
                    </LinearGradient>
                    <Text style={styles.actionText}>Clients</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Profile', { user })}
                >
                    <LinearGradient
                        colors={['#f59e0b', '#d97706']}
                        style={styles.actionIconGradient}
                    >
                        <Feather name="settings" size={28} color="white" />
                    </LinearGradient>
                    <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Estimates Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Estimates</Text>
                {bids.length > 0 && (
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Feather name="file-plus" size={48} color="#475569" />
            </View>
            <Text style={styles.emptyTitle}>No estimates yet</Text>
            <Text style={styles.emptySubtitle}>
                Create your first estimate to get started
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('CreateBid', { userId: user.id })}
            >
                <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    style={styles.emptyButtonGradient}
                >
                    <Text style={styles.emptyButtonText}>Create Estimate</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <FlatList
                    data={bids.slice(0, 5)}
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
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={fetchBids}
                            tintColor="#3b82f6"
                        />
                    }
                    ListEmptyComponent={!loading ? renderEmptyState : null}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    orbContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        overflow: 'hidden',
    },
    orb1: {
        position: 'absolute',
        top: -50,
        right: -50,
    },
    orb2: {
        position: 'absolute',
        top: 100,
        left: -50,
    },
    listContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    greeting: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    username: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginTop: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        backgroundColor: '#ef4444',
        borderRadius: 4,
    },
    avatarGradient: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // AI Banner
    aiBanner: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.3)',
    },
    aiBannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    aiBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    aiIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiBannerText: {},
    aiBannerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    aiBannerSubtitle: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
    aiBannerArrow: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Stats
    statsScroll: {
        marginBottom: 24,
    },
    statsContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    statsCard: {
        width: 150,
        height: 160,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    statsCardContent: {},
    statsIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statsValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    statsTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
    statsSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginTop: 2,
    },
    circuitDecor: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    circuitLine: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 1,
    },
    circuitDot: {
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 3,
        marginLeft: 4,
    },
    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    seeAll: {
        color: '#60a5fa',
        fontSize: 14,
        fontWeight: '600',
    },
    // Action Grid
    actionGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 32,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    actionIconGradient: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    // Empty State
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    emptyTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#64748b',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    emptyButtonGradient: {
        paddingHorizontal: 32,
        paddingVertical: 14,
    },
    emptyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
