import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/formacionStyles';
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


