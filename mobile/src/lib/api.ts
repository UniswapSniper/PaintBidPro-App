import { Alert } from 'react-native';

// Use your computer's local IP address here
export const API_URL = 'http://192.168.1.73:3000/api';

export const api = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');
            return { user: data.user, error: null };
        } catch (error) {
            console.error('Login error:', error);
            return { user: null, error };
        }
    },

    async signup(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Signup failed');
            return { user: data.user, error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { user: null, error };
        }
    },

    async getBids(userId) {
        try {
            const response = await fetch(`${API_URL}/bids?userId=${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Fetch bids failed');
            return { data: data.bids, error: null };
        } catch (error) {
            console.error('Get bids error:', error);
            return { data: [], error };
        }
    },

    async createBid(bidData) {
        try {
            const response = await fetch(`${API_URL}/bids`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bidData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Create bid failed');
            return { data: data.bid, error: null };
        } catch (error) {
            console.error('Create bid error:', error);
            return { data: null, error };
        }
    },

    async getClients(userId) {
        try {
            const response = await fetch(`${API_URL}/clients?userId=${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Fetch clients failed');
            return { data: data.clients, error: null };
        } catch (error) {
            console.error('Get clients error:', error);
            return { data: [], error };
        }
    },

    async createClient(clientData) {
        try {
            const response = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Create client failed');
            return { data: data.client, error: null };
        } catch (error) {
            console.error('Create client error:', error);
            return { data: null, error };
        }
    },

    async getProfile(userId) {
        try {
            const response = await fetch(`${API_URL}/profile?userId=${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Fetch profile failed');
            return { data: data.profile, error: null };
        } catch (error) {
            console.error('Get profile error:', error);
            return { data: null, error };
        }
    },

    async updateProfile(profileData) {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Update profile failed');
            return { data: data.profile, error: null };
        } catch (error) {
            console.error('Update profile error:', error);
            return { data: null, error };
        }
    }
};
