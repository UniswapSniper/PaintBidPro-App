import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, FlatList, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, API_URL } from '../lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { generateBidHTML } from '../utils/BidPdfTemplate';

export default function CreateBidScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const userId = route.params?.userId;
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Data
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    // Form State
    const [projectName, setProjectName] = useState('');
    const [address, setAddress] = useState('');
    const [scopeOfWork, setScopeOfWork] = useState('');

    // Dimensions
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    // Items
    const [items, setItems] = useState<any[]>([]);
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);

    const COST_PER_SQ_FT = profile?.default_rate ? parseFloat(profile.default_rate) : 2.50;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [clientsRes, profileRes] = await Promise.all([
            api.getClients(userId),
            api.getProfile(userId)
        ]);

        if (clientsRes.data) setClients(clientsRes.data);
        if (profileRes.data) setProfile(profileRes.data);
    };

    // AI: Generate Scope of Work
    const generateScope = async () => {
        if (!projectName && !length) {
            Alert.alert('Info Needed', 'Please enter a project name/dimensions first so AI has context.');
            return;
        }
        setAiLoading(true);
        try {
            const res = await fetch(`${API_URL}/ai/estimate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'text',
                    data: {
                        project: projectName,
                        dimensions: `${length}x${width}x${height} ft`,
                        client: selectedClient?.name
                    }
                })
            });
            const json = await res.json();
            if (json.result) {
                setScopeOfWork(json.result);
            }
        } catch (e) {
            Alert.alert('AI Error', 'Failed to generate scope.');
        } finally {
            setAiLoading(false);
        }
    };

    // Photos
    const [photos, setPhotos] = useState<string[]>([]);

    // AI: Analyze Photo
    const analyzeRoom = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setAiLoading(true);
            try {
                const res = await fetch(`${API_URL}/ai/estimate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'image',
                        data: { image: result.assets[0].base64 }
                    })
                });
                const json = await res.json();

                if (json.result && json.result.prep_items) {
                    const prepItems = json.result.prep_items;
                    Alert.alert(
                        'AI Analysis Complete',
                        `Complexity: ${json.result.complexity}\n\nSuggested Prep:\n- ${prepItems.join('\n- ')}`,
                        [
                            {
                                text: 'Add Items',
                                onPress: () => {
                                    const newItems = prepItems.map((desc: string) => ({
                                        description: `Prep: ${desc}`,
                                        quantity: 1,
                                        unit_price: 50.00, // Default prep fee
                                        total: 50.00
                                    }));
                                    setItems(prev => [...prev, ...newItems]);
                                }
                            },
                            { text: 'Cancel', style: 'cancel' }
                        ]
                    );
                }
            } catch (e) {
                Alert.alert('AI Error', 'Failed to analyze image.');
            } finally {
                setAiLoading(false);
            }
        }
    };

    // Photo Markup Flow
    const handleAddPhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "Camera access is needed.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            // Navigate to Markup Screen
            navigation.navigate('PhotoMarkup', {
                imageUri: result.assets[0].uri,
                onSave: (markedUpUri: string) => {
                    setPhotos(prev => [...prev, markedUpUri]);
                }
            });
        }
    };

    // AI Video Coach Flow
    const handleVideoScan = () => {
        navigation.navigate('VideoEstimator', {
            onAnalysisComplete: (result: any) => {
                // Populate the scope text and maybe add items
                if (result.summary) {
                    setScopeOfWork(prev => prev ? prev + "\n" + result.summary : result.summary);
                }
                if (result.suggestedItems) {
                    setItems(prev => [...prev, ...result.suggestedItems]);
                }
            }
        });
    };

    const calculateWallArea = () => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        const h = parseFloat(height);

        if (isNaN(l) || isNaN(w) || isNaN(h)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for dimensions.');
            return;
        }

        const perimeter = (l + w) * 2;
        const wallArea = perimeter * h;
        const cost = wallArea * COST_PER_SQ_FT;

        // Check if "Wall Painting" item exists, if so update it, else add it
        const newItems = items.filter(i => i.description !== 'Wall Painting (Base)');
        newItems.unshift({
            description: 'Wall Painting (Base)',
            quantity: wallArea.toFixed(0) + ' sqft',
            unit_price: COST_PER_SQ_FT,
            total: cost
        });

        setItems(newItems);
        // Alert.alert('Calculated', `Detailed est. added: ${wallArea.toFixed(0)} sq ft x $${COST_PER_SQ_FT} = $${cost.toFixed(2)}`);
    };

    const addItem = () => {
        if (!newItemDesc || !newItemPrice) return;
        const price = parseFloat(newItemPrice);
        setItems([...items, {
            description: newItemDesc,
            quantity: 1,
            unit_price: price,
            total: price // Assuming qty 1 for custom items for now
        }]);
        setNewItemDesc('');
        setNewItemPrice('');
        setIsAddingItem(false);
    };

    const getTotalCost = () => {
        return items.reduce((sum, item) => sum + (item.total || 0), 0);
    };

    const handleSaveAndShare = async () => {
        if (!projectName || items.length === 0) {
            Alert.alert('Error', 'Project Name and at least one item are required.');
            return;
        }

        setLoading(true);

        // 1. Save to Backend
        const bidData = {
            userId: userId,
            client_id: selectedClient?.id,
            project_name: projectName,
            address: address || selectedClient?.address,
            room_dimensions: { length, width, height },
            total_sq_ft: 0, // Calculated in items now
            estimated_cost: getTotalCost(),
            items: items,
            status: 'sent',
            scope_of_work: scopeOfWork // Now saving this!
        };

        const { data: savedBid, error } = await api.createBid(bidData);

        if (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to save bid.');
            return;
        }

        // 2. Generate PDF
        try {
            // Updated to pass scopeOfWork
            const html = generateBidHTML({ ...savedBid.bid, scope_of_work: scopeOfWork }, items, selectedClient, profile);
            const { uri } = await Print.printToFileAsync({ html });

            setLoading(false);

            // 3. Share
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            navigation.goBack();

        } catch (err) {
            setLoading(false);
            console.error(err);
            Alert.alert('Error', 'Failed to generate PDF');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Estimate</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Client Section */}
                <Text style={styles.sectionTitle}>Client</Text>
                <TouchableOpacity
                    style={styles.clientSelector}
                    onPress={() => setShowClientModal(true)}
                >
                    <View>
                        <Text style={styles.clientName}>{selectedClient ? selectedClient.name : 'Select Client...'}</Text>
                        {selectedClient && <Text style={styles.clientSub}>{selectedClient.email}</Text>}
                    </View>
                    <Feather name="chevron-down" size={20} color="#94a3b8" />
                </TouchableOpacity>

                {/* Project Details */}
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={styles.sectionTitle}>Project Info</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity onPress={handleAddPhoto} style={[styles.aiButton, { backgroundColor: '#db2777' }]} disabled={loading}>
                            <Feather name="edit-2" size={16} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.aiButtonText}>Add Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleVideoScan} style={[styles.aiButton, { backgroundColor: '#f59e0b' }]} disabled={aiLoading}>
                            <Feather name="video" size={16} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.aiButtonText}>AI Coach</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={analyzeRoom} style={styles.aiButton} disabled={aiLoading}>
                            <Feather name="camera" size={16} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.aiButtonText}>Scan Room</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

                {/* Photos List */}
                {photos.length > 0 && (
                    <ScrollView horizontal style={styles.photoList} showsHorizontalScrollIndicator={false}>
                        {photos.map((uri, index) => (
                            <Image key={index} source={{ uri }} style={styles.photoThumb} />
                        ))}
                    </ScrollView>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Project Name (e.g. Master Bedroom)"
                    placeholderTextColor="#64748b"
                    value={projectName}
                    onChangeText={setProjectName}
                />

                {/* Scope of Work with AI */}
                <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
                    <Text style={styles.label}>Scope of Work</Text>
                    <TouchableOpacity onPress={generateScope} disabled={aiLoading}>
                        <View style={styles.magicButton}>
                            <Feather name="zap" size={14} color="#eab308" style={{ marginRight: 4 }} />
                            <Text style={{ color: '#eab308', fontWeight: 'bold', fontSize: 12 }}>Auto-Write</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Detailed description of work..."
                    placeholderTextColor="#64748b"
                    multiline
                    value={scopeOfWork}
                    onChangeText={setScopeOfWork}
                />

                {/* Dimensions Calculator */}
                <View style={styles.calcContainer}>
                    <Text style={styles.calcTitle}>Quick Calculator (Walls)</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.smallInput} placeholder="L" placeholderTextColor="#64748b" keyboardType="numeric" value={length} onChangeText={setLength} />
                        <TextInput style={styles.smallInput} placeholder="W" placeholderTextColor="#64748b" keyboardType="numeric" value={width} onChangeText={setWidth} />
                        <TextInput style={styles.smallInput} placeholder="H" placeholderTextColor="#64748b" keyboardType="numeric" value={height} onChangeText={setHeight} />
                        <TouchableOpacity style={styles.calcButton} onPress={calculateWallArea}>
                            <Text style={styles.calcButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Line Items */}
                <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 8 }]}>
                    <Text style={styles.sectionTitle}>Line Items</Text>
                    <TouchableOpacity onPress={() => setIsAddingItem(!isAddingItem)}>
                        <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>+ Add Custom</Text>
                    </TouchableOpacity>
                </View>

                {isAddingItem && (
                    <View style={styles.addItemBox}>
                        <TextInput
                            style={[styles.input, { marginBottom: 8 }]}
                            placeholder="Description (e.g. Ceiling)"
                            placeholderTextColor="#64748b"
                            value={newItemDesc}
                            onChangeText={setNewItemDesc}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="Price ($)"
                                placeholderTextColor="#64748b"
                                keyboardType="numeric"
                                value={newItemPrice}
                                onChangeText={setNewItemPrice}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={addItem}>
                                <Feather name="check" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <Text style={styles.itemSub}>{item.quantity} @ ${item.unit_price}</Text>
                        </View>
                        <Text style={styles.itemPrice}>${item.total.toFixed(2)}</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Estimate</Text>
                    <Text style={styles.totalValue}>${getTotalCost().toFixed(2)}</Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, (loading || aiLoading) && styles.buttonDisabled]}
                    onPress={handleSaveAndShare}
                    disabled={loading || aiLoading}
                >
                    {(loading || aiLoading) ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View style={styles.row}>
                            <Feather name="share" size={18} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Save & Share PDF</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Client Modal */}
            <Modal visible={showClientModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Client</Text>
                        <FlatList
                            data={clients}
                            keyExtractor={i => i.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedClient(item);
                                        setShowClientModal(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                    <Text style={styles.modalItemSub}>{item.address}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowClientModal(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    backButton: { padding: 4 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20, paddingBottom: 100 },
    sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
    input: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, color: 'white', fontSize: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
    clientSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#3b82f6' },
    clientName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    clientSub: { color: '#94a3b8', fontSize: 13 },
    calcContainer: { backgroundColor: '#0f172a', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
    calcTitle: { color: '#cbd5e1', marginBottom: 12, fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center' },
    smallInput: { flex: 1, backgroundColor: '#1e293b', padding: 10, borderRadius: 8, color: 'white', marginRight: 8, textAlign: 'center' },
    calcButton: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    calcButtonText: { color: 'white', fontWeight: 'bold' },
    addItemBox: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 16 },
    addButton: { backgroundColor: '#22c55e', padding: 14, borderRadius: 8 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 8 },
    itemDesc: { color: 'white', fontSize: 16 },
    itemSub: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
    itemPrice: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 16 },
    totalLabel: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    totalValue: { color: '#3b82f6', fontSize: 24, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#020617', borderTopWidth: 1, borderTopColor: '#1e293b' },
    button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, maxHeight: '80%' },
    modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
    modalItemText: { color: 'white', fontSize: 16, fontWeight: '600' },
    modalItemSub: { color: '#94a3b8', fontSize: 14 },
    closeButton: { marginTop: 16, alignItems: 'center', padding: 12 },
    closeButtonText: { color: '#ef4444', fontSize: 16 },
    // AI Specific Styles
    aiButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7c3aed', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    aiButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    magicButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#331f00', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#eab308' },
    label: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
    photoList: { marginBottom: 20 },
    photoThumb: { width: 80, height: 80, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#334155' },
});
