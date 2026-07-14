import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Modal, Image, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import DatePicker from '../../components/ui/DatePicker';

export default function PerfilScreen() {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Campos del formulario de edición de perfil
  const [editName, setEditName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');
  


  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleOpenEditModal = () => {
    setEditName(user?.name || '');
    setEditLastName(user?.last_name || '');
    setEditHeadline(user?.headline || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setEditBirthday(user?.birthday || '');
    setEditAvatar(user?.avatar || '');
    setEditError('');
    setShowEditModal(true);
  };

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setEditError('Necesitamos permisos de galería para poder seleccionar una imagen.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.base64) {
          setEditAvatar(`data:image/jpeg;base64,${selectedAsset.base64}`);
        } else if (selectedAsset.uri) {
          setEditAvatar(selectedAsset.uri);
        }
      }
    } catch (error: any) {
      console.error('Error selecting image:', error);
      setEditError('Error al seleccionar la imagen.');
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setEditError('El nombre es obligatorio.');
      return;
    }
    setIsUpdating(true);
    setEditError('');
    try {
      await updateProfile({
        name: editName,
        last_name: editLastName || null,
        headline: editHeadline || null,
        phone: editPhone || null,
        location: editLocation || null,
        birthday: editBirthday || null,
        avatar: editAvatar || null,
      });
      setShowEditModal(false);
    } catch (err: any) {
      setEditError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c20', '#15102a', '#06030d']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <ThemedText type="subtitle" style={styles.headerTitle}>Mi Perfil</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ff453a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Principal de Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={56} color="rgba(255, 255, 255, 0.7)" />
            )}
          </View>
          <ThemedText type="subtitle" style={styles.userName}>
            {user?.name} {user?.last_name || ''}
          </ThemedText>
          {user?.headline ? (
            <ThemedText style={styles.userHeadline}>{user.headline}</ThemedText>
          ) : null}
          <ThemedText style={styles.userEmail}>{user?.email || 'correo@ejemplo.com'}</ThemedText>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {user?.role === 'empresa' ? 'Empresa / Reclutador' : 'Trabajador / Candidato'}
            </ThemedText>
          </View>

          {/* Botón Editar Perfil (Solo para Trabajadores por ahora) */}
          {user?.role === 'trabajador' && (
            <TouchableOpacity style={styles.editProfileButton} onPress={handleOpenEditModal}>
              <Ionicons name="create-outline" size={18} color="#ffffff" />
              <ThemedText style={styles.editProfileButtonText}>Editar Perfil</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Sección: Detalles de Contacto / Personales (Solo para Trabajadores) */}
        {user?.role === 'trabajador' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Detalles Personales</ThemedText>
            </View>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="call-outline" size={20} color="#3b82f6" />
                <View>
                  <ThemedText style={styles.detailLabel}>Teléfono</ThemedText>
                  <ThemedText style={styles.detailValue}>{user.phone || 'No especificado'}</ThemedText>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={20} color="#3b82f6" />
                <View>
                  <ThemedText style={styles.detailLabel}>Ubicación</ThemedText>
                  <ThemedText style={styles.detailValue}>{user.location || 'No especificada'}</ThemedText>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                <View>
                  <ThemedText style={styles.detailLabel}>Cumpleaños</ThemedText>
                  <ThemedText style={styles.detailValue}>{user.birthday || 'No especificado'}</ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Sección: Experiencia */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Experiencia Laboral</ThemedText>
          </View>
          <View style={styles.experienceItem}>
            <ThemedText style={styles.itemTitle}>Desarrollador Junior Frontend</ThemedText>
            <ThemedText style={styles.itemSubtitle}>Tech Solutions - (2025 - Presente)</ThemedText>
            <ThemedText style={styles.itemDescription}>Desarrollo de aplicaciones web y móviles utilizando React Native y TypeScript.</ThemedText>
          </View>
        </View>

        {/* Sección: Educación */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Educación</ThemedText>
          </View>
          <View style={styles.experienceItem}>
            <ThemedText style={styles.itemTitle}>Grado Superior en Desarrollo de Aplicaciones Multiplataforma</ThemedText>
            <ThemedText style={styles.itemSubtitle}>Instituto Tecnológico - (2023 - 2025)</ThemedText>
          </View>
        </View>

        {/* Sección: Habilidades */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={20} color="#3b82f6" />
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Habilidades</ThemedText>
          </View>
          <View style={styles.skillsWrapper}>
            {['React Native', 'TypeScript', 'JavaScript', 'Laravel', 'MySQL', 'Git'].map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <ThemedText style={styles.skillText}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Confirmación de Cierre de Sesión */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={25} tint="dark" style={styles.modalBlur}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconBg}>
                <Ionicons name="log-out" size={32} color="#ff453a" />
              </View>
              <ThemedText style={styles.modalTitle}>Cerrar Sesión</ThemedText>
              <ThemedText style={styles.modalMessage}>
                ¿Estás seguro de que deseas cerrar sesión en GrowUpJob?
              </ThemedText>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <ThemedText style={styles.modalButtonCancelText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={() => {
                    setShowLogoutModal(false);
                    logout();
                  }}
                >
                  <ThemedText style={styles.modalButtonConfirmText}>Cerrar</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Modal de Edición de Perfil */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.editModalOverlay}>
          <BlurView intensity={30} tint="dark" style={styles.editModalBlur}>
            <View style={styles.editModalCard}>
              <View style={styles.editModalHeader}>
                <ThemedText style={styles.editModalTitle}>Editar Perfil</ThemedText>
                <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {editError ? (
                <View style={styles.modalErrorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff453a" />
                  <ThemedText style={styles.modalErrorText}>{editError}</ThemedText>
                </View>
              ) : null}

              <ScrollView style={styles.editFormScroll} contentContainerStyle={styles.editFormContent}>
                
                {/* Campo: Imagen de Perfil (Subir desde el dispositivo) */}
                <ThemedText style={styles.inputLabel}>Foto de Perfil</ThemedText>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handleSelectImage}>
                  <Ionicons name="cloud-upload-outline" size={20} color="#3b82f6" style={styles.inputIcon} />
                  <ThemedText style={styles.imagePickerButtonText}>
                    {editAvatar ? 'Cambiar Imagen' : 'Subir desde el dispositivo'}
                  </ThemedText>
                </TouchableOpacity>

                {/* Previsualización rápida */}
                {editAvatar ? (
                  <View style={styles.avatarPreviewContainer}>
                    <Image source={{ uri: editAvatar }} style={styles.avatarPreview} />
                    <TouchableOpacity onPress={() => setEditAvatar('')} style={styles.clearAvatarBtn}>
                      <ThemedText style={styles.clearAvatarText}>Eliminar foto</ThemedText>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Campo: Nombre */}
                <ThemedText style={styles.inputLabel}>Nombre</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Tu Nombre"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={editName}
                    onChangeText={setEditName}
                  />
                </View>

                {/* Campo: Apellidos */}
                <ThemedText style={styles.inputLabel}>Apellidos</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="person-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Tus Apellidos"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={editLastName}
                    onChangeText={setEditLastName}
                  />
                </View>

                {/* Campo: Perfil profesional */}
                <ThemedText style={styles.inputLabel}>Perfil Profesional</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="briefcase-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej. Desarrollador React Native"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={editHeadline}
                    onChangeText={setEditHeadline}
                  />
                </View>

                {/* Campo: Teléfono */}
                <ThemedText style={styles.inputLabel}>Teléfono</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="call-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="+34 600 000 000"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={editPhone}
                    onChangeText={setEditPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Campo: Ubicación */}
                <ThemedText style={styles.inputLabel}>Ubicación</ThemedText>
                <View style={styles.modalInputWrapper}>
                  <Ionicons name="location-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ciudad, País"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={editLocation}
                    onChangeText={setEditLocation}
                  />
                </View>

                {/* Campo: Cumpleaños */}
                <ThemedText style={styles.inputLabel}>Cumpleaños</ThemedText>
                <DatePicker value={editBirthday} onChange={setEditBirthday} />

              </ScrollView>

              <View style={styles.editModalFooter}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowEditModal(false)}
                  disabled={isUpdating}
                >
                  <ThemedText style={styles.modalButtonCancelText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSave}
                  onPress={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <ThemedText style={styles.modalButtonSaveText}>Guardar</ThemedText>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.15)',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userHeadline: {
    color: '#3b82f6',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tag: {
    backgroundColor: '#3b82f630',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  tagText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  editProfileButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  experienceItem: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    paddingLeft: 16,
    marginLeft: 8,
  },
  itemTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#3b82f6',
    fontSize: 13,
    marginTop: 2,
  },
  itemDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    color: '#ffffff',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: 'rgba(21, 16, 40, 0.95)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtonCancelText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff453a',
  },
  modalButtonConfirmText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalBlur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalCard: {
    width: '90%',
    height: '80%',
    maxHeight: 650,
    backgroundColor: 'rgba(21, 16, 40, 0.98)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editModalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  editFormScroll: {
    flex: 1,
  },
  editFormContent: {
    paddingBottom: 20,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    paddingHorizontal: 12,
    height: 48,
  },
  modalInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    height: '100%',
    marginLeft: 8,
  },

  inputIcon: {
    marginRight: 4,
  },
  avatarPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 8,
    borderRadius: 12,
  },
  avatarPreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  clearAvatarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
  },
  clearAvatarText: {
    color: '#ff453a',
    fontSize: 12,
    fontWeight: '600',
  },
  editModalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 16,
  },
  modalButtonSave: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
  },
  modalButtonSaveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  modalErrorText: {
    color: '#ff453a',
    fontSize: 13,
    flex: 1,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  imagePickerButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
});
