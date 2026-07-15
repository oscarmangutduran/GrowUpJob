import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarPosition: Platform.OS === 'web' ? 'top' : 'bottom',
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.45)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#02060E',
          borderTopWidth: Platform.OS === 'web' ? 0 : 1,
          borderTopColor: Platform.OS === 'web' ? 'transparent' : 'rgba(197, 3, 55, 0.15)',
          borderBottomWidth: Platform.OS === 'web' ? 1 : 0,
          borderBottomColor: Platform.OS === 'web' ? 'rgba(197, 3, 55, 0.15)' : 'transparent',
          height: 60,
          paddingBottom: Platform.OS === 'web' ? 0 : 8,
          paddingTop: Platform.OS === 'web' ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Empleo',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="empleo-publico"
        options={{
          title: 'Empleo Público',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="formacion"
        options={{
          title: 'Formación',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'school' : 'school-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="empresas"
        options={{
          title: 'Empresas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'business' : 'business-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insignias"
        options={{
          title: 'Insignias',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
