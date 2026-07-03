import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí, cerrar', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c20', '#15102a', '#06030d']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <ThemedText type="subtitle" style={styles.headerTitle}>Mi Perfil</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ff453a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Principal de Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={56} color="rgba(255, 255, 255, 0.7)" />
          </View>
          <ThemedText type="subtitle" style={styles.userName}>{user?.name || 'Nombre del Candidato'}</ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email || 'correo@ejemplo.com'}</ThemedText>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {user?.role === 'empresa' ? 'Empresa / Reclutador' : 'Trabajador / Candidato'}
            </ThemedText>
          </View>
        </View>

        {/* Sección: Experiencia */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Experiencia Laboral</ThemedText>
          </View>
          <View style={styles.experienceItem}>
            <ThemedText style={styles.itemTitle}>Desarrollador Junior Frontend</ThemedText>
            <ThemedText style={styles.itemSubtitle}>Tech Solutions - (2025 - Presente)</ThemedText>
            <ThemedText style={styles.itemDescription}>Desarrollo de aplicaciones web y móviles utilizando React Native y TypeScript.</ThemedText>
          </View>
        </View>

        {/* Sección: Educación */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Educación</ThemedText>
          </View>
          <View style={styles.experienceItem}>
            <ThemedText style={styles.itemTitle}>Grado Superior en Desarrollo de Aplicaciones Multiplataforma</ThemedText>
            <ThemedText style={styles.itemSubtitle}>Instituto Tecnológico - (2023 - 2025)</ThemedText>
          </View>
        </View>

        {/* Sección: Habilidades */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Habilidades</ThemedText>
          </View>
          <View style={styles.skillsWrapper}>
            {['React Native', 'TypeScript', 'JavaScript', 'Laravel', 'MySQL', 'Git'].map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <ThemedText style={styles.skillText}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.15)',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tag: {
    backgroundColor: '#3b82f630',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  tagText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  experienceItem: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    paddingLeft: 16,
    marginLeft: 8,
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#3b82f6',
    fontSize: 13,
    marginTop: 2,
  },
  itemDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    color: '#ffffff',
    fontSize: 13,
  },
});
