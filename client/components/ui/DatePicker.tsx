import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '../themed-text';

interface DatePickerProps {
  value: string; // Format DD/MM/YYYY
  onChange: (value: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper to parse date string (DD/MM/YYYY) to Date object
  const parseDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed month
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    // Try ISO format YYYY-MM-DD
    const isoParts = dateStr.split('-');
    if (isoParts.length === 3) {
      const year = parseInt(isoParts[0], 10);
      const month = parseInt(isoParts[1], 10) - 1;
      const day = parseInt(isoParts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Helper to format Date object to DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onChange(formatDate(selectedDate));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.modalInputWrapper}
        onPress={() => setShowDatePicker(!showDatePicker)}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
        <ThemedText style={[styles.modalInputText, !value && styles.placeholderText]}>
          {value || 'DD/MM/AAAA'}
        </ThemedText>
        <Ionicons 
          name={showDatePicker ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="rgba(255, 255, 255, 0.4)" 
        />
      </TouchableOpacity>

      {/* iOS: Beautiful inline calendar, toggled collapsible under the field */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosInlineContainer}>
          <DateTimePicker
            value={parseDateString(value)}
            mode="date"
            display="inline"
            onChange={handleDateChange}
            maximumDate={new Date()}
            themeVariant="dark"
          />
        </View>
      )}

      {/* Android: Dialog style native date picker */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={parseDateString(value)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  modalInputText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 8,
    textAlignVertical: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  inputIcon: {
    marginRight: 4,
  },
  // iOS Inline Styles
  iosInlineContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
});
