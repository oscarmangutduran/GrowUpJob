import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/empleoPublicoStyles';
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
      colors={['#02060E', '#3a0814', '#02060E']}
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
            placeholderTextColor="rgba(15, 23, 42, 0.45)"
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
                  <Ionicons name="document-text" size={24} color="#C50337" />
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


