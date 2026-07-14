import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface Course {
  id: number;
  title: string;
  provider: string;
  duration: string;
  modality: string;
  category: string;
}

export default function FormacionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const mockCourses: Course[] = [
    { id: 1, title: 'Masterclass en React Native y Expo', provider: 'GrowUp Academy', duration: '40 horas', modality: 'Online (Asíncrono)', category: 'Desarrollo' },
    { id: 2, title: 'Introducción a Laravel 11', provider: 'PHP Institute', duration: '25 horas', modality: 'Online (En Vivo)', category: 'Desarrollo' },
    { id: 3, title: 'Diseño UX/UX para Aplicaciones Híbridas', provider: 'Creative School', duration: '30 horas', modality: 'Presencial', category: 'Diseño' },
    { id: 4, title: 'Estrategias de Marketing Digital', provider: 'GrowUp Academy', duration: '50 horas', modality: 'Online (Asíncrono)', category: 'Marketing' },
    { id: 5, title: 'Metodologías Ágiles y Scrum Master', provider: 'Agile World', duration: '15 horas', modality: 'Híbrido', category: 'Gestión' },
  ];

  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Formación</ThemedText>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos, categorías..."
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
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => alert(`Inscribirse en ${course.title}`)}>
              <View style={styles.courseCardHeader}>
                <View style={styles.providerIconBg}>
                  <Ionicons name="school" size={24} color="#C50337" />
                </View>
                <View style={styles.courseTitleContainer}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.providerName}>{course.provider}</ThemedText>
                </View>
              </View>

              <View style={styles.courseCardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <ThemedText style={styles.detailText}>Duración: {course.duration}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="videocam-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <ThemedText style={styles.detailText}>Modalidad: {course.modality}</ThemedText>
                </View>
              </View>

              <View style={styles.courseCardFooter}>
                <View style={styles.categoryBadge}>
                  <ThemedText style={styles.categoryText}>{course.category}</ThemedText>
                </View>
                <ThemedText style={styles.enrollText}>Inscribirse &rarr;</ThemedText>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
            <ThemedText style={styles.emptyText}>No se encontraron cursos disponibles.</ThemedText>
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  courseCard: {
    backgroundColor: 'rgba(2, 6, 14, 0.65)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 3, 55, 0.25)',
  },
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  providerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(197, 3, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitleContainer: {
    flex: 1,
  },
  courseTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerName: {
    color: '#C50337',
    fontSize: 13,
    marginTop: 2,
  },
  courseCardDetails: {
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
  courseCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
  },
  enrollText: {
    color: '#C50337',
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
