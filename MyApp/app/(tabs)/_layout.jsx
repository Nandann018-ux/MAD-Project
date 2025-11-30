import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.solid,
        tabBarInactiveTintColor: Colors.text.secondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: Colors.primary.solid,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
              shadowColor: Colors.primary.solid,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <IconSymbol size={28} name="plus" color="#FFF" />
            </View>
          ),
          tabBarLabelStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.crop.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}

