import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Briefcase, Landmark, BookOpen, Building2, User } from 'lucide-react-native';
import { supabase } from '../services/supabase';

// Real Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EmpleoScreen from '../screens/main/EmpleoScreen';
import EmpleoPublicoScreen from '../screens/main/EmpleoPublicoScreen';
import CursosScreen from '../screens/main/CursosScreen';
import EmpresasScreen from '../screens/main/EmpresasScreen';
import PerfilScreen from '../screens/main/PerfilScreen';
import InsigniasScreen from '../screens/main/InsigniasScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff', elevation: 1 },
        headerTitleStyle: { fontWeight: '800', color: '#0f172a', fontSize: 17 },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Empleo"
        component={EmpleoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          headerTitle: 'GrowUpJob — Ofertas',
        }}
      />
      <Tab.Screen
        name="Público"
        component={EmpleoPublicoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Landmark size={size} color={color} />,
          headerTitle: 'Empleo Público & BOE',
        }}
      />
      <Tab.Screen
        name="Cursos"
        component={CursosScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: 'Cursos & Certificaciones',
        }}
      />
      <Tab.Screen
        name="Empresas"
        component={EmpresasScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
          headerTitle: 'Directorio Antighosting',
        }}
      />
      <Tab.Screen
        name="Perfil"
        children={() => (
          <PerfilScreen
            onLogout={onLogout}
          />
        )}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Mi Perfil & CV',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabNavigator
                {...props}
                onLogout={() => {
                  setSession(null);
                  supabase.auth.signOut();
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Insignias"
            component={InsigniasScreen}
            options={{ headerShown: true, title: 'Insignias y Verificaciones' }}
          />
        </>
      ) : (
        <>
          {authView === 'login' ? (
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={() => setSession({ user: { email: 'demo@growupjob.com' } })}
                  onNavigateToRegister={() => setAuthView('register')}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen
                  {...props}
                  onRegisterSuccess={() => setSession({ user: { email: 'demo@growupjob.com' } })}
                  onNavigateToLogin={() => setAuthView('login')}
                />
              )}
            </Stack.Screen>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
