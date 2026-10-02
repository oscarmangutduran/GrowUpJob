import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Briefcase, Landmark, BookOpen, Building2, User } from 'lucide-react-native';
import { supabase } from '../services/supabase';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import EmpleoScreen from '../screens/main/EmpleoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Temporary placeholders for other tabs
import { Text, StyleSheet } from 'react-native';

function EmpleoPublicoPlaceholder() {
  return (
    <View style={styles.center}>
      <Landmark size={48} color="#2563eb" />
      <Text style={styles.title}>Empleo Público & Oposiciones</Text>
      <Text style={styles.subtitle}>Convocatorias oficiales del BOE actualizadas en tiempo real.</Text>
    </View>
  );
}

function CursosPlaceholder() {
  return (
    <View style={styles.center}>
      <BookOpen size={48} color="#2563eb" />
      <Text style={styles.title}>Cursos & Especializaciones</Text>
      <Text style={styles.subtitle}>Formación técnica certificada y bootcamps becados.</Text>
    </View>
  );
}

function EmpresasPlaceholder() {
  return (
    <View style={styles.center}>
      <Building2 size={48} color="#2563eb" />
      <Text style={styles.title}>Directorio Antighosting</Text>
      <Text style={styles.subtitle}>Empresas con métricas de trato y tiempo de respuesta garantizado.</Text>
    </View>
  );
}

function PerfilPlaceholder() {
  return (
    <View style={styles.center}>
      <User size={48} color="#2563eb" />
      <Text style={styles.title}>Mi Perfil & CV ATS</Text>
      <Text style={styles.subtitle}>Seguimiento de candidaturas y portfolio sincronizado.</Text>
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { fontWeight: '800', color: '#0f172a' },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
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
        component={EmpleoPublicoPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => <Landmark size={size} color={color} />,
          headerTitle: 'Empleo Público',
        }}
      />
      <Tab.Screen
        name="Cursos"
        component={CursosPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: 'Formación y Cursos',
        }}
      />
      <Tab.Screen
        name="Empresas"
        component={EmpresasPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
          headerTitle: 'Empresas Verificadas',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Mi Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={() => setSession({ user: { email: 'demo@growupjob.com' } })}
              onNavigateToRegister={() => {}}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
