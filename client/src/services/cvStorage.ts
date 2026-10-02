import * as DocumentPicker from 'expo-document-picker';
import { supabase } from './supabase';

export async function uploadUserCV(userId: string) {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const fileExt = asset.name.split('.').pop();
    const filePath = `${userId}/cv_${Date.now()}.${fileExt}`;

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('cvs')
      .upload(filePath, blob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) throw error;

    const fileSizeMb = (asset.size ? (asset.size / (1024 * 1024)).toFixed(1) : '1.2') + ' MB';

    await supabase
      .from('profiles')
      .update({
        cv_title: asset.name,
        cv_path: filePath,
        cv_size: fileSizeMb,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return { filePath, name: asset.name, size: fileSizeMb };
  } catch (error: any) {
    console.error('Error al subir el CV a Supabase Storage:', error.message);
    throw error;
  }
}
