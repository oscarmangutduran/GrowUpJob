import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import styles from '../../css/indexStyles';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Job {
  id: number;
  title: string;
  company_name: string;
  description: string;
  location: string;
  salary: string | null;
  type: string;
}

export default function EmpleoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Formulario de nueva oferta de empleo
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newType, setNewType] = useState('Remoto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleCreateJob = async () => {
    if (!newTitle || !newDescription || !newLocation || !newType) {
      setModalError('Por favor, rellena los campos obligatorios.');
      return;
    }
    
    setIsSubmitting(true);
    setModalError(null);
    try {
      await apiRequest('/job-listings', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          company_name: user?.name || 'Empresa Anónima',
          description: newDescription,
          location: newLocation,
          salary: newSalary || null,
          type: newType,
        }),
      });
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewLocation('');
      setNewSalary('');
      setNewType('Remoto');
      setShowAddModal(false);
      // Refresh jobs list
      fetchJobs(searchQuery);
    } catch (error: any) {
      setModalError(error.message || 'Error al publicar la oferta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchJobs = async (search = '') => {
    try {
      const url = search ? `/job-listings?search=${encodeURIComponent(search)}` : '/job-listings';
      const response = await apiRequest(url);
      if (response.status === 'success' && response.listings) {
        setJobs(response.listings);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchQuery);
  }, [searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchJobs(searchQuery);
  };

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empleo Privado</ThemedText>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar puestos, empresas..."
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#ffffff" />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C50337" />
          </View>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => alert(`Postularse a ${job.title}`)}>
                <View style={styles.jobCardHeader}>
                  <View style={styles.companyIconBg}>
                    <Ionicons name="briefcase" size={24} color="#C50337" />
                  </View>
                  <View style={styles.jobTitleContainer}>
                    <ThemedText style={styles.jobTitle}>{job.title}</ThemedText>
                    <ThemedText style={styles.companyName}>{job.company_name}</ThemedText>
                  </View>
                </View>

                <View style={styles.jobCardDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <ThemedText style={styles.detailText}>{job.location}</ThemedText>
                  </View>
                  {job.salary ? (
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                      <ThemedText style={styles.detailText}>{job.salary}</ThemedText>
                    </View>
                  ) : null}
                </View>

                <View style={styles.jobCardFooter}>
                  <View style={styles.typeBadge}>
                    <ThemedText style={styles.typeText}>{job.type}</ThemedText>
                  </View>
                  <ThemedText style={styles.postulateText}>Postularse &rarr;</ThemedText>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
              <ThemedText style={styles.emptyText}>No se encontraron ofertas de empleo.</ThemedText>
            </View>
          )}
        </ScrollView>

      {user?.role === 'empresa' && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>
      )}

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Publicar Oferta</ThemedText>
                <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {modalError ? (
                <View style={styles.modalErrorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff453a" />
                  <ThemedText style={styles.modalErrorText}>{modalError}</ThemedText>
                </View>
              ) : null}

              <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.inputLabel}>Título del Puesto *</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="briefcase-outline" size={20} color="rgba(15, 23, 42, 0.45)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej. Desarrollador React Native"
                    placeholderTextColor="rgba(15, 23, 42, 0.45)"
                    value={newTitle}
                    onChangeText={setNewTitle}
                  />
                </View>

                <ThemedText style={styles.inputLabel}>Ubicación *</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="location-outline" size={20} color="rgba(15, 23, 42, 0.45)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej. Madrid, España (o Remoto)"
                    placeholderTextColor="rgba(15, 23, 42, 0.45)"
                    value={newLocation}
                    onChangeText={setNewLocation}
                  />
                </View>

                <ThemedText style={styles.inputLabel}>Salario (Opcional)</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="cash-outline" size={20} color="rgba(15, 23, 42, 0.45)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej. 30.000€ - 35.000€"
                    placeholderTextColor="rgba(15, 23, 42, 0.45)"
                    value={newSalary}
                    onChangeText={setNewSalary}
                  />
                </View>

                <ThemedText style={styles.inputLabel}>Tipo de Jornada *</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="time-outline" size={20} color="rgba(15, 23, 42, 0.45)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej. Jornada Completa / Remoto"
                    placeholderTextColor="rgba(15, 23, 42, 0.45)"
                    value={newType}
                    onChangeText={setNewType}
                  />
                </View>

                <ThemedText style={styles.inputLabel}>Descripción del Puesto *</ThemedText>
                <View style={styles.modalInputAreaWrapper}>
                  <TextInput
                    style={styles.modalInputArea}
                    placeholder="Describe los requisitos, responsabilidades y lo que ofrece la empresa..."
                    placeholderTextColor="rgba(15, 23, 42, 0.45)"
                    value={newDescription}
                    onChangeText={setNewDescription}
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  <ThemedText style={styles.modalButtonCancelText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSave}
                  onPress={handleCreateJob}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <ThemedText style={styles.modalButtonSaveText}>Publicar</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>
    </LinearGradient>
  );
}
