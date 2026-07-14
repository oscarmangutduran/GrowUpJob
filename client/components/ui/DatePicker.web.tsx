import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
  value: string; // Format DD/MM/YYYY
  onChange: (value: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const convertToISODate = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const formatISODateToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const handlePress = () => {
    if (inputRef.current) {
      try {
        if (typeof inputRef.current.showPicker === 'function') {
          inputRef.current.showPicker();
        } else {
          inputRef.current.focus();
        }
      } catch (_e) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.modalInputWrapper}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Ionicons name="calendar-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
      <input
        ref={inputRef}
        type="date"
        value={convertToISODate(value)}
        onChange={(e) => onChange(formatISODateToDDMMYYYY(e.target.value))}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: 'none',
          outline: 'none',
          height: '100%',
          fontSize: '14px',
          marginLeft: '8px',
          fontFamily: 'System',
          cursor: 'pointer',
        }}
      />
    </TouchableOpacity>
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
  inputIcon: {
    marginRight: 4,
  },
});
