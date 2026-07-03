import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface PublicJob {
  id: number;
  title: string;
  organism: string;
  places: number;
  deadline: string;
  type: string;
}

export default function EmpleoPublicoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const mockPublicJobs: PublicJob[] = [
    { id: 1, title: 'Auxiliar Administrativo del Estado', organism: 'Ministerio de Hacienda', places: 1250, deadline: '25/08/2026', type: 'Oposición Libre' },
    { id: 2, title: 'Enfermero/a de Atención Primaria', organism: 'Servicio de Salud de la Comunidad', places: 340, deadline: '15/07/2026', type: 'Concurso-Oposición' },
    { id: 3, title: 'Técnico de Soporte Informático', organism: 'Ayuntamiento de Madrid', places: 15, deadline: '30/08/2026', type: 'Oposición' },
    { id: 4, title: 'Profesor de Enseñanza Secundaria (Informática)', organism: 'Consejería de Educación', places: 120, deadline: '10/09/2026', type: 'Concurso-Oposición' },
    { id: 5, title: 'Agente de Policía Local', organism: 'Ayuntamiento', places: 45, deadline: '05/08/2026', type: 'Oposición' },
  ];

  const filteredJobs = mockPublicJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.organism.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#0f0c20', '#15102a', '#06030d']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empleo Público</ThemedText>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar convocatorias, organismos..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            {...Platform.select({
              web: {
                outlineStyle: 'none' as any,
              },
              default: {},
            })}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => alert(`Más detalles de ${job.title}`)}>
              <View style={styles.jobCardHeader}>
                <View style={styles.organismIconBg}>
                  <Ionicons name="document-text" size={24} color="#a855f7" />
                </View>
                <View style={styles.jobTitleContainer}>
                  <ThemedText style={styles.jobTitle}>{job.title}</ThemedText>
                  <ThemedText style={styles.organismName}>{job.organism}</ThemedText>
                </View>
              </View>

              <View style={styles.jobCardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <ThemedText style={styles.detailText}>Plazas convocadas: {job.places}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <ThemedText style={styles.detailText}>Plazo límite: {job.deadline}</ThemedText>
                </View>
              </View>

              <View style={styles.jobCardFooter}>
                <View style={styles.typeBadge}>
                  <ThemedText style={styles.typeText}>{job.type}</ThemedText>
                </View>
                <ThemedText style={styles.postulateText}>Ver Bases &rarr;</ThemedText>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
            <ThemedText style={styles.emptyText}>No se encontraron convocatorias públicas.</ThemedText>
          </View>
        )}
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  jobCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  organismIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  organismName: {
    color: '#a855f7',
    fontSize: 13,
    marginTop: 2,
  },
  jobCardDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  postulateText: {
    color: '#a855f7',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    textAlign: 'center',
  },
});
