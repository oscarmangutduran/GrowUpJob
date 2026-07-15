import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/formacionStyles';
import { ThemedText } from '../../components/themed-text';

interface Course {
  id: number;
  title: string;
  provider: string;
  duration: number;
  modality: string;
  category: string;
  professionalFamily: string;
  skills: string[];
}

const familiasProfesionales = [
  'Todo',
  'Actividades Físicas y Deportivas',
  'Administración y Gestión',
  'Agraria',
  'Artes Gráficas',
  'Artes y Artesanías',
  'Comercio y Marketing',
  'Edificación y Obra Civil',
  'Electricidad y Electrónica',
  'Energía y Agua',
  'Fabricación Mecánica',
  'Hostelería y Turismo',
  'Imagen Personal',
  'Imagen y Sonido',
  'Industrias Alimentarias',
  'Industrias Extractivas',
  'Informática y Comunicaciones',
  'Instalación y Mantenimiento',
  'Madera, Mueble y Corcho',
  'Marítimo-Pesquera',
  'Química',
  'Sanidad',
  'Seguridad y Medio Ambiente',
  'Servicios Socioculturales y a la Comunidad',
  'Textil, Confección y Piel',
  'Transporte y Mantenimiento de Vehículos',
  'Vidrio y Cerámica'
];

const aptitudesPorFamilia: Record<string, string[]> = {
  'Informática y Comunicaciones': ['Desarrollo Frontend', 'Desarrollo Backend', 'Bases de Datos', 'Administración de Sistemas', 'Ciberseguridad'],
  'Administración y Gestión': ['Gestión Documental', 'Atención al Cliente', 'Contabilidad', 'Herramientas Ofimáticas', 'Organización de Eventos'],
  'Sanidad': ['Primeros Auxilios', 'Cuidados Básicos', 'Soporte Vital', 'Farmacología', 'Higiene Hospitalaria'],
  'Seguridad y Medio Ambiente': ['Prevención de Riesgos', 'Gestión de Residuos', 'Control de Incendios', 'Conservación Ambiental'],
  'Servicios Socioculturales y a la Comunidad': ['Integración Social', 'Educación Infantil', 'Atención a la Diversidad', 'Mediación Familiar', 'Animación Sociocultural'],
  'Hostelería y Turismo': ['Servicio de Mesa', 'Gestión Hotelera', 'Guía Turístico', 'Seguridad Alimentaria', 'Cocina Básica'],
  'Edificación y Obra Civil': ['Lectura de Planos', 'Prevención en Obra', 'Topografía', 'Diseño CAD', 'Cálculo de Estructuras']
};

export default function FormacionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterFamily, setFilterFamily] = useState('');
  const [filterDuration, setFilterDuration] = useState('Todo');
  const [filterSkill, setFilterSkill] = useState('');
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const mockCourses: Course[] = [
    { 
      id: 1, 
      title: 'Masterclass en React Native y Expo', 
      provider: 'GrowUp Academy', 
      duration: 40, 
      modality: 'Online (Asíncrono)', 
      category: 'Desarrollo Web',
      professionalFamily: 'Informática y Comunicaciones',
      skills: ['Desarrollo Frontend', 'Bases de Datos']
    },
    { 
      id: 2, 
      title: 'Introducción a Laravel 11', 
      provider: 'PHP Institute', 
      duration: 25, 
      modality: 'Online (En Vivo)', 
      category: 'Desarrollo Web',
      professionalFamily: 'Informática y Comunicaciones',
      skills: ['Desarrollo Backend', 'Bases de Datos']
    },
    { 
      id: 3, 
      title: 'Gestión Documental y Archivo Digital', 
      provider: 'Creative School', 
      duration: 30, 
      modality: 'Presencial', 
      category: 'Administración',
      professionalFamily: 'Administración y Gestión',
      skills: ['Gestión Documental', 'Herramientas Ofimáticas']
    },
    { 
      id: 4, 
      title: 'Primeros Auxilios y Soporte Vital Básico', 
      provider: 'Cruz Roja Formación', 
      duration: 15, 
      modality: 'Presencial', 
      category: 'Sanidad',
      professionalFamily: 'Sanidad',
      skills: ['Primeros Auxilios', 'Soporte Vital']
    },
    { 
      id: 5, 
      title: 'Prevención de Riesgos Laborales en Edificación', 
      provider: 'Safety First', 
      duration: 60, 
      modality: 'Híbrido', 
      category: 'Prevención',
      professionalFamily: 'Edificación y Obra Civil',
      skills: ['Prevención en Obra', 'Lectura de Planos']
    },
    { 
      id: 6, 
      title: 'Educación Infantil y Atención Temprana', 
      provider: 'Educa Center', 
      duration: 120, 
      modality: 'Online (Asíncrono)', 
      category: 'Educación',
      professionalFamily: 'Servicios Socioculturales y a la Comunidad',
      skills: ['Educación Infantil', 'Atención a la Diversidad']
    },
    { 
      id: 7, 
      title: 'Seguridad Alimentaria y APPCC', 
      provider: 'Gastro School', 
      duration: 12, 
      modality: 'Online (Asíncrono)', 
      category: 'Hostelería',
      professionalFamily: 'Hostelería y Turismo',
      skills: ['Seguridad Alimentaria', 'Cocina Básica']
    }
  ];

  const handleClearFilters = () => {
    setFilterFamily('');
    setFilterDuration('Todo');
    setFilterSkill('');
    setShowFamilyDropdown(false);
    setShowSkillDropdown(false);
  };

  const handleSelectFamily = (family: string) => {
    const selectedFam = family === 'Todo' ? '' : family;
    setFilterFamily(selectedFam);
    
    // Si la aptitud seleccionada no está dentro de la nueva familia elegida, la reseteamos
    const skills = getAptitudesDisponibles(selectedFam);
    if (filterSkill && !skills.includes(filterSkill)) {
      setFilterSkill('');
    }
  };

  const getAptitudesDisponibles = (family: string) => {
    if (!family || family === 'Todo') {
      return ['Todo'];
    }
    return ['Todo', ...(aptitudesPorFamilia[family] || [])];
  };

  const filteredCourses = mockCourses.filter(course => {
    const matchesQuery = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFamily = !filterFamily || course.professionalFamily === filterFamily;
    
    let matchesDuration = true;
    if (filterDuration === '< 20h') {
      matchesDuration = course.duration < 20;
    } else if (filterDuration === '20h-50h') {
      matchesDuration = course.duration >= 20 && course.duration <= 50;
    } else if (filterDuration === '> 50h') {
      matchesDuration = course.duration > 50;
    }
    
    const matchesSkill = !filterSkill || course.skills.includes(filterSkill);
    
    return matchesQuery && matchesFamily && matchesDuration && matchesSkill;
  });

  const hasActiveFilters = filterFamily || filterDuration !== 'Todo' || filterSkill;

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Formación</ThemedText>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.searchSection}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cursos, categorías..."
              placeholderTextColor="rgba(15, 23, 42, 0.45)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                <Ionicons name="close-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, (showFilters || hasActiveFilters) ? styles.filterButtonActive : null]} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filterPanel}>
            {/* Familia profesional */}
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <ThemedText style={styles.filterLabel}>Familia Profesional</ThemedText>
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => {
                    setShowFamilyDropdown(!showFamilyDropdown);
                    setShowSkillDropdown(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name="briefcase-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                    <ThemedText numberOfLines={1} style={styles.dropdownButtonText}>
                      {filterFamily || 'Todas'}
                    </ThemedText>
                  </View>
                  <Ionicons name={showFamilyDropdown ? "chevron-up" : "chevron-down"} size={16} color="rgba(15, 23, 42, 0.45)" />
                </TouchableOpacity>
                
                {showFamilyDropdown && (
                  <View style={styles.dropdownList}>
                    {familiasProfesionales.map((fam) => (
                      <TouchableOpacity
                        key={fam}
                        style={[
                          styles.dropdownItem,
                          (filterFamily === fam || (!filterFamily && fam === 'Todo')) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                        ]}
                        onPress={() => {
                          handleSelectFamily(fam);
                          setShowFamilyDropdown(false);
                        }}
                      >
                        <ThemedText style={[
                          styles.dropdownItemText,
                          (filterFamily === fam || (!filterFamily && fam === 'Todo')) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                        ]}>
                          {fam}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Aptitudes de la familia profesional */}
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <ThemedText style={styles.filterLabel}>Aptitudes de la Familia</ThemedText>
                <TouchableOpacity 
                  style={[styles.dropdownButton, !filterFamily ? { opacity: 0.6 } : null]} 
                  disabled={!filterFamily}
                  onPress={() => {
                    setShowSkillDropdown(!showSkillDropdown);
                    setShowFamilyDropdown(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name="star-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                    <ThemedText numberOfLines={1} style={styles.dropdownButtonText}>
                      {!filterFamily ? 'Selecciona una familia primero...' : (filterSkill || 'Todas')}
                    </ThemedText>
                  </View>
                  <Ionicons name={showSkillDropdown ? "chevron-up" : "chevron-down"} size={16} color="rgba(15, 23, 42, 0.45)" />
                </TouchableOpacity>
                
                {showSkillDropdown && (
                  <View style={styles.dropdownList}>
                    {getAptitudesDisponibles(filterFamily).map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.dropdownItem,
                          (filterSkill === skill || (!filterSkill && skill === 'Todo')) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                        ]}
                        onPress={() => {
                          setFilterSkill(skill === 'Todo' ? '' : skill);
                          setShowSkillDropdown(false);
                        }}
                      >
                        <ThemedText style={[
                          styles.dropdownItemText,
                          (filterSkill === skill || (!filterSkill && skill === 'Todo')) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                        ]}>
                          {skill}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Duración del curso */}
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <ThemedText style={styles.filterLabel}>Duración del Curso</ThemedText>
                <View style={styles.filterSelectorRow}>
                  {['Todo', '< 20h', '20h-50h', '> 50h'].map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[styles.filterBadge, filterDuration === dur ? styles.filterBadgeActive : null]}
                      onPress={() => setFilterDuration(dur)}
                    >
                      <ThemedText style={[styles.filterBadgeText, filterDuration === dur ? styles.filterBadgeTextActive : null]}>
                        {dur}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Acciones */}
            <View style={styles.filterPanelActions}>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearFilters}>
                <Ionicons name="trash-outline" size={16} color="#C50337" />
                <ThemedText style={styles.clearFiltersText}>Limpiar Filtros</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
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
                    <ThemedText style={styles.detailText}>Duración: {course.duration} horas</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="videocam-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <ThemedText style={styles.detailText}>Modalidad: {course.modality}</ThemedText>
                  </View>
                </View>

                {/* Insignias de familia profesional y aptitudes */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <ThemedText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}>{course.professionalFamily}</ThemedText>
                  </View>
                  {course.skills.map((skill, index) => (
                    <View key={index} style={{ backgroundColor: 'rgba(197, 3, 55, 0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <ThemedText style={{ color: '#ff4d6d', fontSize: 11, fontWeight: '500' }}>{skill}</ThemedText>
                    </View>
                  ))}
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
              <ThemedText style={styles.emptyText}>No se encontraron cursos con los criterios seleccionados.</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
