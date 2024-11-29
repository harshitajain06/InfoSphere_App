// src/navigation/StackLayout.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomePage from './index'; // Import WelcomePage
import HomePage from './HomeScreen'; // Adjust the path if necessary
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // If using Expo

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
 
// Drawer Navigator Component
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen 
        name="Home" 
        component={HomePage} 
        options={{ title: 'Home' }} 
      />
      {/* You can add more screens to the drawer if needed */}
      <Drawer.Screen
        name="Logout"
        component={HomePage} // You might want to replace this with an actual Logout function or screen
        options={{
          title: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault(); // Prevent navigation
            Alert.alert('Logout', 'Are you sure you want to log out?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: () => {
                  // Handle logout logic here
                },
              },
            ]);
          },
        }}
      />
    </Drawer.Navigator>
  );
};

// Stack Navigator Component
export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      }}
    >
      {/* Welcome Page as the initial screen */}
      <Stack.Screen name="Welcome" component={WelcomePage} />
      {/* Main App with Drawer */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
