import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/empresasStyles';
import { ThemedText } from '../../components/themed-text';
import { apiRequest } from '../../services/api';

interface Company {
  id: number | string;
  name: string;
  industry: string;
  size: string;
  description: string;
  jobsCount: number;
  comunidad?: string;
  provincia?: string;
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

const sectoresDisponibles = [
  'Todo',
  'Desarrollo de Software',
  'Big Data & IA',
  'Consultoría TI',
  'Diseño Gráfico y UI/UX',
  'Sector General'
];

const mockCompanies: Company[] = [
  { 
    id: 1, 
    name: 'AppCreators', 
    industry: 'Desarrollo de Software', 
    size: '50-100 empleados', 
    description: 'Empresa líder en el desarrollo de aplicaciones móviles nativas e híbridas.', 
    jobsCount: 3,
    comunidad: 'Comunidad de Madrid',
    provincia: 'Madrid'
  },
  { 
    id: 2, 
    name: 'Global Data', 
    industry: 'Big Data & IA', 
    size: '100-500 empleados', 
    description: 'Servicios de análisis de datos e infraestructura inteligente en la nube.', 
    jobsCount: 5,
    comunidad: 'Andalucía',
    provincia: 'Sevilla'
  },
  { 
    id: 3, 
    name: 'Bussines Consult', 
    industry: 'Consultoría TI', 
    size: '500+ empleados', 
    description: 'Consultoría estratégica para implantaciones ERP y transformación digital.', 
    jobsCount: 2,
    comunidad: 'Cataluña',
    provincia: 'Barcelona'
  },
  { 
    id: 4, 
    name: 'Pixel Art', 
    industry: 'Diseño Gráfico y UI/UX', 
    size: '10-50 empleados', 
    description: 'Agencia boutique especializada en diseño de experiencias e identidad visual.', 
    jobsCount: 1,
    comunidad: 'Andalucía',
    provincia: 'Málaga'
  },
  { 
    id: 5, 
    name: 'CodeDev', 
    industry: 'Desarrollo de Software', 
    size: '20-50 empleados', 
    description: 'Factoría de software ágil especializada en Laravel, Vue y React.', 
    jobsCount: 4,
    comunidad: 'Castilla-La Mancha',
    provincia: 'Toledo'
  },
];

export default function EmpresasScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados de filtros
  const [filterComunidad, setFilterComunidad] = useState('');
  const [filterProvincia, setFilterProvincia] = useState('');
  const [filterSector, setFilterSector] = useState('');
  
  // Estados de apertura de desplegables
  const [showComunidadDropdown, setShowComunidadDropdown] = useState(false);
  const [showProvinciaDropdown, setShowProvinciaDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await apiRequest('/companies');
        if (response.status === 'success' && response.companies) {
          const dbCompanies = response.companies.map((u: any) => {
            // Extraer información aproximada si existe o defaults
            let prov = 'Madrid';
            let com = 'Comunidad de Madrid';
            
            if (u.location) {
              const parts = u.location.split(',');
              if (parts.length >= 2) {
                prov = parts[0].trim();
                com = parts[1].trim();
              } else if (parts.length === 1) {
                prov = parts[0].trim();
                // Buscar si la provincia pertenece a alguna comunidad autonoma
                const matchedCom = Object.keys(comunidadesConProvincias).find(key => 
                  comunidadesConProvincias[key].includes(prov)
                );
                if (matchedCom) {
                  com = matchedCom;
                }
              }
            }
            
            return {
              id: `db-${u.id}`,
              name: u.name,
              industry: u.headline || 'Sector General',
              size: u.location || 'Localización no especificada',
              description: `Empresa registrada en GrowUpJob. Contacto: ${u.email}`,
              jobsCount: 0,
              comunidad: com,
              provincia: prov
            };
          });
          setCompanies([...dbCompanies, ...mockCompanies]);
        } else {
          setCompanies(mockCompanies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies(mockCompanies);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleClearFilters = () => {
    setFilterComunidad('');
    setFilterProvincia('');
    setFilterSector('');
    setShowComunidadDropdown(false);
    setShowProvinciaDropdown(false);
    setShowSectorDropdown(false);
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
      return ['Todo'];
    }
    return ['Todo', ...(comunidadesConProvincias[comunidadSeleccionada] || [])];
  };

  const filteredCompanies = companies.filter(company => {
    const matchesQuery = !searchQuery || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesComunidad = !filterComunidad || company.comunidad === filterComunidad;
    const matchesProvincia = !filterProvincia || company.provincia === filterProvincia;
    const matchesSector = !filterSector || company.industry === filterSector;
    
    return matchesQuery && matchesComunidad && matchesProvincia && matchesSector;
  });

  const hasActiveFilters = filterComunidad || filterProvincia || filterSector;

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empresas</ThemedText>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.searchSection}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar empresas, sectores..."
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
            {/* Comunidad y Provincia */}
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <ThemedText style={styles.filterLabel}>Comunidad Autónoma</ThemedText>
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => {
                    setShowComunidadDropdown(!showComunidadDropdown);
                    setShowProvinciaDropdown(false);
                    setShowSectorDropdown(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name="map-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                    <ThemedText numberOfLines={1} style={styles.dropdownButtonText}>
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
                  style={[styles.dropdownButton, !filterComunidad ? { opacity: 0.6 } : null]} 
                  disabled={!filterComunidad}
                  onPress={() => {
                    setShowProvinciaDropdown(!showProvinciaDropdown);
                    setShowComunidadDropdown(false);
                    setShowSectorDropdown(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name="location-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                    <ThemedText numberOfLines={1} style={styles.dropdownButtonText}>
                      {!filterComunidad ? 'Elige comunidad...' : (filterProvincia || 'Todas')}
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

            {/* Sector */}
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <ThemedText style={styles.filterLabel}>Sector</ThemedText>
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => {
                    setShowSectorDropdown(!showSectorDropdown);
                    setShowComunidadDropdown(false);
                    setShowProvinciaDropdown(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name="construct-outline" size={16} color="rgba(15, 23, 42, 0.45)" />
                    <ThemedText numberOfLines={1} style={styles.dropdownButtonText}>
                      {filterSector || 'Todos los sectores'}
                    </ThemedText>
                  </View>
                  <Ionicons name={showSectorDropdown ? "chevron-up" : "chevron-down"} size={16} color="rgba(15, 23, 42, 0.45)" />
                </TouchableOpacity>
                
                {showSectorDropdown && (
                  <View style={styles.dropdownList}>
                    {sectoresDisponibles.map((sec) => (
                      <TouchableOpacity
                        key={sec}
                        style={[
                          styles.dropdownItem,
                          (filterSector === sec || (!filterSector && sec === 'Todo')) ? { backgroundColor: 'rgba(197, 3, 55, 0.08)' } : null
                        ]}
                        onPress={() => {
                          setFilterSector(sec === 'Todo' ? '' : sec);
                          setShowSectorDropdown(false);
                        }}
                      >
                        <ThemedText style={[
                          styles.dropdownItemText,
                          (filterSector === sec || (!filterSector && sec === 'Todo')) ? { color: '#ff4d6d', fontWeight: 'bold' } : null
                        ]}>
                          {sec}
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
          {isLoading ? (
            <ActivityIndicator size="large" color="#C50337" style={{ marginTop: 40 }} />
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TouchableOpacity key={company.id} style={styles.companyCard} onPress={() => alert(`Detalles de ${company.name}`)}>
                <View style={styles.companyCardHeader}>
                  <View style={styles.companyIconBg}>
                    <Ionicons name="business" size={24} color="#C50337" />
                  </View>
                  <View style={styles.companyTitleContainer}>
                    <ThemedText style={styles.companyName}>{company.name}</ThemedText>
                    <ThemedText style={styles.companyIndustry}>{company.industry}</ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.companyDescription}>{company.description}</ThemedText>

                {/* Insignia de ubicación (Provincia y Comunidad) */}
                {(company.provincia || company.comunidad) && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <ThemedText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}>
                        {company.provincia ? `${company.provincia} (${company.comunidad})` : company.comunidad}
                      </ThemedText>
                    </View>
                  </View>
                )}

                <View style={styles.companyCardFooter}>
                  <View style={styles.sizeBadge}>
                    <Ionicons name="people-outline" size={14} color="rgba(255, 255, 255, 0.5)" />
                    <ThemedText style={styles.sizeText}>{company.size}</ThemedText>
                  </View>
                  <ThemedText style={styles.activeJobsText}>{company.jobsCount} ofertas activas &rarr;</ThemedText>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
              <ThemedText style={styles.emptyText}>No se encontraron empresas con los criterios seleccionados.</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
