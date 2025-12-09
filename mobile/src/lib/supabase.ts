import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Helper to persist the session securely on the device
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key);
    },
};

// Start with placeholders. The User must replace these or use .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fowgpcoiathxwcxokplj.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvd2dwY29pYXRoeHdjeG9rcGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDA5NzMsImV4cCI6MjA4MDcxNjk3M30.GHGv7S8r-HQrzCfcJ1hRp-kA-r8RO0TLrKdaHBVvjLY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
