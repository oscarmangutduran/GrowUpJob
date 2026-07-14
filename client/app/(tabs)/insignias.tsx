import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/insigniasStyles';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export default function InsigniasScreen() {
  const router = useRouter();

  const mockBadges: Badge[] = [
    { id: 1, title: 'Primer Registro', description: '¡Bienvenido a bordo! Has completado tu cuenta.', icon: 'rocket', color: '#10b981', unlocked: true },
    { id: 2, title: 'Cuenta Vinculada', description: 'Has enlazado tu perfil con Google de forma segura.', icon: 'key', color: '#C50337', unlocked: true },
    { id: 3, title: 'Currículum al 100%', description: 'Completaste todos los campos de tu currículum vitae.', icon: 'document-text', color: '#f59e0b', unlocked: false },
    { id: 4, title: 'Primer Postulante', description: 'Te has inscrito a tu primera oferta de empleo.', icon: 'send', color: '#a855f7', unlocked: false },
    { id: 5, title: 'Estudiante Constante', description: 'Completaste tu primer curso formativo.', icon: 'ribbon', color: '#ec4899', unlocked: false },
  ];

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Mis Insignias</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.overviewCard}>
          <Ionicons name="trophy" size={48} color="#f59e0b" style={styles.trophyIcon} />
          <ThemedText type="subtitle" style={styles.overviewTitle}>Progreso de Logros</ThemedText>
          <ThemedText style={styles.overviewSubtitle}>
            Has desbloqueado {mockBadges.filter(b => b.unlocked).length} de {mockBadges.length} insignias totales.
          </ThemedText>
        </View>

        <View style={styles.badgeList}>
          {mockBadges.map((badge) => (
            <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeLockedCard]}>
              <View style={[styles.iconBg, { backgroundColor: badge.unlocked ? badge.color + '15' : 'rgba(255, 255, 255, 0.05)' }]}>
                <Ionicons
                  name={badge.unlocked ? (badge.icon as any) : 'lock-closed'}
                  size={26}
                  color={badge.unlocked ? badge.color : 'rgba(255, 255, 255, 0.3)'}
                />
              </View>

              <View style={styles.badgeTextContainer}>
                <View style={styles.badgeHeaderRow}>
                  <ThemedText style={[styles.badgeTitle, !badge.unlocked && styles.badgeLockedText]}>{badge.title}</ThemedText>
                  {badge.unlocked ? (
                    <View style={[styles.statusBadge, { backgroundColor: '#10b98120' }]}>
                      <ThemedText style={styles.statusTextUnlocked}>Desbloqueado</ThemedText>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
                      <ThemedText style={styles.statusTextLocked}>Bloqueado</ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}


