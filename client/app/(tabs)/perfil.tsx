import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Modal, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/perfilStyles';
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
  const [editCvBase64, setEditCvBase64] = useState<string | null>(null);
  const [editCvName, setEditCvName] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  const handleSelectCV = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            setEditCvBase64(reader.result as string);
            setEditCvName(file.name);
          };
        }
      };
      input.click();
    } else {
      Alert.alert('Subir archivo', 'Esta funcionalidad en móvil requiere expo-document-picker.');
    }
  };
  


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
    setEditCvBase64(null);
    setEditCvName(null);
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
        cv_base64: editCvBase64 || null,
      });
      setEditCvBase64(null);
      setEditCvName(null);
      setShowEditModal(false);
    } catch (err: any) {
      setEditError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
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

        {/* Sección: Currículum Vitae (Solo para Trabajadores) */}
        {user?.role === 'trabajador' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#C50337" />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Currículum Vitae</ThemedText>
            </View>
            <View style={styles.detailsGrid}>
              {user.cv_path ? (
                <View style={{ gap: 12 }}>
                  <ThemedText style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                    Currículum subido correctamente en formato PDF.
                  </ThemedText>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#C50337',
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      alignSelf: 'flex-start',
                      gap: 8,
                    }}
                    onPress={() => {
                      const { Linking } = require('react-native');
                      Linking.openURL(user.cv_path!);
                    }}
                  >
                    <Ionicons name="eye-outline" size={18} color="#ffffff" />
                    <ThemedText style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>
                      Ver o Descargar Currículum
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <ThemedText style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: 13 }}>
                    No has subido ningún currículum todavía. Edita tu perfil para subir tu currículum en PDF.
                  </ThemedText>
                </View>
              )}
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

                {/* Campo: Currículum PDF */}
                <ThemedText style={styles.inputLabel}>Currículum (PDF)</ThemedText>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handleSelectCV}>
                  <Ionicons name="document-attach-outline" size={20} color="#C50337" style={styles.inputIcon} />
                  <ThemedText style={styles.imagePickerButtonText}>
                    {editCvName ? `PDF: ${editCvName}` : (user?.cv_path ? 'Reemplazar PDF actual' : 'Subir Currículum (PDF)')}
                  </ThemedText>
                </TouchableOpacity>

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
