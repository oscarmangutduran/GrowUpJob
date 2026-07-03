import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useThemeColor } from '../../hooks/use-theme-color';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  
  // Colores dinámicos
  const tintColor = useThemeColor({}, 'tint');
  const cardBgColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({}, 'text');

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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Inicio
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Tu portal de empleo GrowUpJob
        </ThemedText>
      </View>

      <View style={styles.content}>
        {/* Card de Perfil */}
        <View style={[styles.profileCard, { backgroundColor: cardBgColor }]}>
          <View style={[styles.avatarContainer, { backgroundColor: tintColor + '15' }]}>
            <Ionicons name="person" size={50} color={tintColor} />
          </View>

          <ThemedText type="subtitle" style={styles.profileName}>
            {user?.name || 'Usuario'}
          </ThemedText>
          <ThemedText style={styles.profileEmail}>
            {user?.email || 'correo@ejemplo.com'}
          </ThemedText>

          {user?.google_id ? (
            <View style={styles.badgeContainer}>
              <Ionicons name="logo-google" size={14} color="#ea4335" />
              <ThemedText style={styles.badgeText}>Cuenta de Google</ThemedText>
            </View>
          ) : (
            <View style={styles.badgeContainer}>
              <Ionicons name="mail" size={14} color={tintColor} />
              <ThemedText style={styles.badgeText}>Cuenta de Correo</ThemedText>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={tintColor} />
              <View style={styles.detailTextContainer}>
                <ThemedText style={styles.detailLabel}>Estado de cuenta</ThemedText>
                <ThemedText style={styles.detailValue}>Verificada</ThemedText>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={tintColor} />
              <View style={styles.detailTextContainer}>
                <ThemedText style={styles.detailLabel}>Miembro desde</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recientemente'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Botón Cerrar Sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
            <ThemedText style={styles.logoutButtonText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Sección de bienvenida informativa */}
        <View style={styles.infoSection}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
            ¡Bienvenido a GrowUpJob!
          </ThemedText>
          <ThemedText style={styles.infoDescription}>
            Has iniciado sesión correctamente. En las próximas fases podrás completar tu currículum, subir cartas de presentación y postularte a cientos de ofertas adaptadas a tu perfil.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8e8e9315',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#8e8e9320',
    marginVertical: 20,
  },
  detailsList: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b3010',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#8e8e9310',
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
});
