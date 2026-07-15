import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/empleoPublicoStyles';
import { ThemedText } from '../../components/themed-text';

interface PublicJob {
  id: number;
  title: string;
  organism: string;
  places: number;
  deadline: string;
  type: string;
  entity: 'Junta' | 'Diputación' | 'Estado' | 'Ayuntamiento';
  duration: '6 meses' | '1 año' | 'Plaza fija';
  level: 'A1' | 'A2' | 'B' | 'C1' | 'C2' | 'E';
  comunidad: string;
  provincia: string;
  professionalFamily: string;
}

const comunidadesConProvincias: Record<string, string[]> = {
  'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
  'Principado de Asturias': ['Asturias'],
  'Islas Baleares': ['Islas Baleares'],
  'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
  'Cantabria': ['Cantabria'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
  'Extremadura': ['Badajoz', 'Cáceres'],
  'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  'Comunidad de Madrid': ['Madrid'],
  'Región de Murcia': ['Murcia'],
  'Comunidad Foral de Navarra': ['Navarra'],
  'País Vasco': ['Álava', 'Bizkaia', 'Gipuzkoa'],
  'La Rioja': ['La Rioja'],
  'Ciudades Autónomas': ['Ceuta', 'Melilla']
};

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

export default function EmpleoPublicoScreen() {
  // Estados de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterEntity, setFilterEntity] = useState<string>('Todo');
  const [filterDuration, setFilterDuration] = useState<string>('Todo');
  const [filterLevel, setFilterLevel] = useState<string>('Todo');
  const [filterComunidad, setFilterComunidad] = useState('');
  const [filterProvincia, setFilterProvincia] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [showComunidadDropdown, setShowComunidadDropdown] = useState(false);
  const [showProvinciaDropdown, setShowProvinciaDropdown] = useState(false);

  const mockPublicJobs: PublicJob[] = [
    {
      id: 1,
      title: 'Auxiliar Administrativo del Estado',
      organism: 'Ministerio de Hacienda',
      places: 1250,
      deadline: '25/08/2026',
      type: 'Oposición Libre',
      entity: 'Estado',
      duration: 'Plaza fija',
      level: 'C2',
      comunidad: 'Comunidad de Madrid',
      provincia: 'Madrid',
      professionalFamily: 'Administración y Gestión'
    },
    {
      id: 2,
      title: 'Enfermero/a de Atención Primaria',
      organism: 'Servicio Andaluz de Salud',
      places: 340,
      deadline: '15/07/2026',
      type: 'Concurso-Oposición',
      entity: 'Junta',
      duration: 'Plaza fija',
      level: 'A2',
      comunidad: 'Andalucía',
      provincia: 'Sevilla',
      professionalFamily: 'Sanidad'
    },
    {
      id: 3,
      title: 'Técnico Auxiliar de Informática',
      organism: 'Diputación de Málaga',
      places: 8,
      deadline: '30/08/2026',
      type: 'Oposición',
      entity: 'Diputación',
      duration: '1 año',
      level: 'C1',
      comunidad: 'Andalucía',
      provincia: 'Málaga',
      professionalFamily: 'Informática y Comunicaciones'
    },
    {
      id: 4,
      title: 'Profesor de Enseñanza Secundaria (Informática)',
      organism: 'Consejería de Educación de la Generalitat',
      places: 120,
      deadline: '10/09/2026',
      type: 'Concurso-Oposición',
      entity: 'Junta',
      duration: 'Plaza fija',
      level: 'A1',
      comunidad: 'Cataluña',
      provincia: 'Barcelona',
      professionalFamily: 'Servicios Socioculturales y a la Comunidad'
    },
    {
      id: 5,
      title: 'Agente de Policía Local',
      organism: 'Ayuntamiento de Córdoba',
      places: 45,
      deadline: '05/08/2026',
      type: 'Oposición',
      entity: 'Ayuntamiento',
      duration: 'Plaza fija',
      level: 'C1',
      comunidad: 'Andalucía',
      provincia: 'Córdoba',
      professionalFamily: 'Seguridad y Medio Ambiente'
    },
    {
      id: 6,
      title: 'Administrativo Interino (Sustitución)',
      organism: 'Junta de Castilla y León',
      places: 3,
      deadline: '22/07/2026',
      type: 'Bolsa de Empleo',
      entity: 'Junta',
      duration: '6 meses',
      level: 'C1',
      comunidad: 'Castilla y León',
      provincia: 'Valladolid',
      professionalFamily: 'Administración y Gestión'
    },
    {
      id: 7,
      title: 'Técnico de Gestión de Empleo',
      organism: 'Diputación de Sevilla',
      places: 12,
      deadline: '18/08/2026',
      type: 'Oposición',
      entity: 'Diputación',
      duration: '1 año',
      level: 'A2',
      comunidad: 'Andalucía',
      provincia: 'Sevilla',
      professionalFamily: 'Administración y Gestión'
    },
    {
      id: 8,
      title: 'Operario de Servicios Múltiples',
      organism: 'Ayuntamiento de Badajoz',
      places: 10,
      deadline: '14/09/2026',
      type: 'Oposición',
      entity: 'Ayuntamiento',
      duration: '6 meses',
      level: 'E',
      comunidad: 'Extremadura',
      provincia: 'Badajoz',
      professionalFamily: 'Edificación y Obra Civil'
    },
    {
      id: 9,
      title: 'Subalterno de la Administración',
      organism: 'Diputación de Pontevedra',
      places: 15,
      deadline: '01/10/2026',
      type: 'Oposición',
      entity: 'Diputación',
      duration: 'Plaza fija',
      level: 'E',
      comunidad: 'Galicia',
      provincia: 'Pontevedra',
      professionalFamily: 'Administración y Gestión'
    },
    {
      id: 10,
      title: 'Técnico Superior de Sistemas',
      organism: 'Junta de Comunidades de Castilla-La Mancha',
      places: 25,
      deadline: '30/09/2026',
      type: 'Oposición',
      entity: 'Junta',
      duration: 'Plaza fija',
      level: 'A1',
      comunidad: 'Castilla-La Mancha',
      provincia: 'Toledo',
      professionalFamily: 'Informática y Comunicaciones'
    }
  ];

  const handleClearFilters = () => {
    setFilterEntity('Todo');
    setFilterDuration('Todo');
    setFilterLevel('Todo');
    setFilterComunidad('');
    setFilterProvincia('');
    setFilterFamily('');
    setShowFamilyDropdown(false);
    setShowComunidadDropdown(false);
    setShowProvinciaDropdown(false);
  };

  const handleSelectComunidad = (comunidad: string) => {
    const selectedCom = comunidad === 'Todo' ? '' : comunidad;
    setFilterComunidad(selectedCom);
    
    // Si la provincia seleccionada no está dentro de la nueva comunidad elegida, la reseteamos
    const provs = getProvinciasDisponibles(selectedCom);
    if (filterProvincia && !provs.includes(filterProvincia)) {
      setFilterProvincia('');
    }
  };

  const getProvinciasDisponibles = (comunidadSeleccionada: string) => {
    if (!comunidadSeleccionada || comunidadSeleccionada === 'Todo') {
      const todas = new Set<string>();
      Object.values(comunidadesConProvincias).forEach(list => list.forEach(p => todas.add(p)));
      return ['Todo', ...Array.from(todas)];
    }
    return ['Todo', ...(comunidadesConProvincias[comunidadSeleccionada] || [])];
  };

  const filteredJobs = mockPublicJobs.filter(job => {
    const matchesQuery = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organism.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEntity = filterEntity === 'Todo' || job.entity === filterEntity;
    
    const matchesDuration = filterDuration === 'Todo' || job.duration === filterDuration;
    
    const matchesLevel = filterLevel === 'Todo' || job.level === filterLevel;
    
    const matchesComunidad = !filterComunidad || 
      job.comunidad.toLowerCase().includes(filterComunidad.toLowerCase());
      
    const matchesProvincia = !filterProvincia || 
      job.provincia.toLowerCase().includes(filterProvincia.toLowerCase());
      
    const matchesFamily = !filterFamily || 
      job.professionalFamily.toLowerCase().includes(filterFamily.toLowerCase());
      
    return matchesQuery && matchesEntity && matchesDuration && matchesLevel && matchesComunidad && matchesProvincia && matchesFamily;
  });

  const hasActiveFilters = filterEntity !== 'Todo' || filterDuration !== 'Todo' || filterLevel !== 'Todo' || filterComunidad || filterProvincia || filterFamily;

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empleo Público</ThemedText>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar convocatorias, organismos..."
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
          {/* Entidad convocante */}
          <View style={styles.filterCol}>
            <ThemedText style={styles.filterLabel}>Entidad Convocante</ThemedText>
            <View style={styles.filterSelectorRow}>
              {['Todo', 'Junta', 'Diputación', 'Estado', 'Ayuntamiento'].map((entity) => (
                <TouchableOpacity
                  key={entity}
                  style={[styles.filterBadge, filterEntity === entity ? styles.filterBadgeActive : null]}
                  onPress={() => setFilterEntity(entity)}
                >
                  <ThemedText style={[styles.filterBadgeText, filterEntity === entity ? styles.filterBadgeTextActive : null]}>
                    {entity}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duración */}
          <View style={styles.filterCol}>
            <ThemedText style={styles.filterLabel}>Duración</ThemedText>
            <View style={styles.filterSelectorRow}>
              {['Todo', '6 meses', '1 año', 'Plaza fija'].map((dur) => (
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

          {/* Nivel */}
          <View style={styles.filterCol}>
            <ThemedText style={styles.filterLabel}>Nivel de Oposición</ThemedText>
            <View style={styles.filterSelectorRow}>
              {['Todo', 'A1', 'A2', 'B', 'C1', 'C2', 'E'].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.filterBadge, filterLevel === lvl ? styles.filterBadgeActive : null]}
                  onPress={() => setFilterLevel(lvl)}
                >
                  <ThemedText style={[styles.filterBadgeText, filterLevel === lvl ? styles.filterBadgeTextActive : null]}>
                    {lvl}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comunidad y Provincia */}
          <View style={styles.filterRow}>
            <View style={styles.filterCol}>
              <ThemedText style={styles.filterLabel}>Comunidad Autónoma</ThemedText>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => {
                  setShowComunidadDropdown(!showComunidadDropdown);
                  setShowProvinciaDropdown(false);
                  setShowFamilyDropdown(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="map-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                  <ThemedText style={styles.dropdownButtonText}>
                    {filterComunidad || 'Todas'}
                  </ThemedText>
                </View>
                <Ionicons name={showComunidadDropdown ? "chevron-up" : "chevron-down"} size={16} color="rgba(15, 23, 42, 0.45)" />
              </TouchableOpacity>
              
              {showComunidadDropdown && (
                <View style={styles.dropdownList}>
                  {['Todo', ...Object.keys(comunidadesConProvincias)].map((com) => (
                    <TouchableOpacity
                      key={com}
                      style={[
                        styles.dropdownItem,
                        (filterComunidad === com || (!filterComunidad && com === 'Todo')) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                      ]}
                      onPress={() => {
                        handleSelectComunidad(com);
                        setShowComunidadDropdown(false);
                      }}
                    >
                      <ThemedText style={[
                        styles.dropdownItemText,
                        (filterComunidad === com || (!filterComunidad && com === 'Todo')) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                      ]}>
                        {com}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.filterCol}>
              <ThemedText style={styles.filterLabel}>Provincia</ThemedText>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => {
                  setShowProvinciaDropdown(!showProvinciaDropdown);
                  setShowComunidadDropdown(false);
                  setShowFamilyDropdown(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="location-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                  <ThemedText style={styles.dropdownButtonText}>
                    {filterProvincia || 'Todas'}
                  </ThemedText>
                </View>
                <Ionicons name={showProvinciaDropdown ? "chevron-up" : "chevron-down"} size={16} color="rgba(15, 23, 42, 0.45)" />
              </TouchableOpacity>
              
              {showProvinciaDropdown && (
                <View style={styles.dropdownList}>
                  {getProvinciasDisponibles(filterComunidad).map((prov) => (
                    <TouchableOpacity
                      key={prov}
                      style={[
                        styles.dropdownItem,
                        (filterProvincia === prov || (!filterProvincia && prov === 'Todo')) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                      ]}
                      onPress={() => {
                        setFilterProvincia(prov === 'Todo' ? '' : prov);
                        setShowProvinciaDropdown(false);
                      }}
                    >
                      <ThemedText style={[
                        styles.dropdownItemText,
                        (filterProvincia === prov || (!filterProvincia && prov === 'Todo')) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                      ]}>
                        {prov}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Familia profesional */}
          <View style={styles.filterRow}>
            <View style={styles.filterCol}>
              <ThemedText style={styles.filterLabel}>Familia Profesional</ThemedText>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => {
                  setShowFamilyDropdown(!showFamilyDropdown);
                  setShowComunidadDropdown(false);
                  setShowProvinciaDropdown(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="briefcase-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                  <ThemedText style={styles.dropdownButtonText}>
                    {filterFamily || 'Seleccionar familia...'}
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
                        filterFamily === (fam === 'Todo' ? '' : fam) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                      ]}
                      onPress={() => {
                        setFilterFamily(fam === 'Todo' ? '' : fam);
                        setShowFamilyDropdown(false);
                      }}
                    >
                      <ThemedText style={[
                        styles.dropdownItemText,
                        filterFamily === (fam === 'Todo' ? '' : fam) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                      ]}>
                        {fam}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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

              <View style={styles.badgeContainer}>
                <View style={styles.levelBadge}>
                  <ThemedText style={styles.levelText}>Nivel {job.level}</ThemedText>
                </View>
                <View style={styles.durationBadge}>
                  <ThemedText style={styles.durationText}>{job.duration}</ThemedText>
                </View>
                <View style={[styles.durationBadge, { backgroundColor: 'rgba(197, 3, 55, 0.08)' }]}>
                  <ThemedText style={[styles.durationText, { color: '#ff4d6d' }]}>{job.professionalFamily}</ThemedText>
                </View>
                <View style={styles.locationBadge}>
                  <ThemedText style={styles.locationText}>{job.provincia} ({job.comunidad})</ThemedText>
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
            <ThemedText style={styles.emptyText}>No se encontraron convocatorias públicas con los criterios seleccionados.</ThemedText>
          </View>
        )}
      </View>
      </ScrollView>
    </LinearGradient>
  );
}



