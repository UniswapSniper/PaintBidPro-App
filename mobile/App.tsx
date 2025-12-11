import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import CreateBidScreen from './src/screens/CreateBidScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PhotoMarkupScreen from './src/screens/PhotoMarkupScreen';
import VideoEstimatorScreen from './src/screens/VideoEstimatorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#020617' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Dashboard', headerBackVisible: false }}
        />
        <Stack.Screen
          name="CreateBid"
          component={CreateBidScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Clients"
          component={ClientsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhotoMarkup"
          component={PhotoMarkupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoEstimator"
          component={VideoEstimatorScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
