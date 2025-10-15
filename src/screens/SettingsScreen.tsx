// src/screens/SettingsScreen.tsx

import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';

// Hooks, Utils, and Context
import { useSafePadding } from '@hooks/useSafePadding';
import { useTheme } from '@context/ThemeContext';
import { storage, UserPreferences, ThemeMode } from '@utils/storage';

// Reusable Components
import { SettingsSection } from '@components/SettingsSection';
import { SettingsRow } from '@components/SettingsRow';
import { SegmentedControl } from '@components/SegmentedControl'; // <-- Import new component

// Icons from react-native-heroicons
import {
  SunIcon, MoonIcon, ComputerDesktopIcon, TrashIcon,
  InformationCircleIcon, CodeBracketIcon, PhotoIcon, Squares2X2Icon
} from 'react-native-heroicons/outline';

// A small, local component for the theme toggle buttons
const ThemeToggleButton = ({ icon, label, isActive, onPress }: {
  icon: ReactNode; label: string; isActive: boolean; onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 flex-row items-center justify-center space-x-2 rounded-lg border py-2.5
      ${isActive
        ? 'border-light-accent bg-light-accent dark:border-dark-accent dark:bg-dark-accent'
        : 'border-light-border bg-light-background dark:border-dark-border dark:bg-dark-background'
      }`}
  >
    {icon}
    <Text className={`font-medium ${isActive ? 'text-white' : 'text-light-text dark:text-dark-text'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Main Screen Component
export default function SettingsScreen() {
  const { paddingTop } = useSafePadding();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const loadPrefs = async () => {
      const p = await storage.getPreferences();
      setPreferences(p);
    };
    loadPrefs();
  }, []);

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;
    HapticFeedback.trigger('impactLight');
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    await storage.setPreferences(updated);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    HapticFeedback.trigger('impactLight');
    setThemeMode(mode);
  };

  const handleClearCache = () => {
    HapticFeedback.trigger('impactMedium');
    Alert.alert('Clear Cache', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await storage.clearAllCache();
        Alert.alert('Success', 'Cache has been cleared.');
      }},
    ]);
  };
  
  const handleClearDownloads = () => {
    HapticFeedback.trigger('impactMedium');
    Alert.alert('Clear Downloads', 'This will delete your download history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete All', style: 'destructive', onPress: async () => {
        // Here you would also delete local files
        await storage.removeDownload('all');
        Alert.alert('Success', 'Download history has been cleared.');
      }},
    ]);
  };

  return (
    <View style={{ paddingTop }} className="flex-1 bg-light-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-light-text dark:text-dark-text">
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <View className="flex-row space-x-2">
            <ThemeToggleButton
              label="Light"
              icon={<SunIcon size={20} className={themeMode === 'light' ? 'text-white' : 'text-light-text dark:text-dark-text'} />}
              isActive={themeMode === 'light'}
              onPress={() => handleThemeChange('light')}
            />
            <ThemeToggleButton
              label="Dark"
              icon={<MoonIcon size={20} className={themeMode === 'dark' ? 'text-white' : 'text-light-text dark:text-dark-text'} />}
              isActive={themeMode === 'dark'}
              onPress={() => handleThemeChange('dark')}
            />
            <ThemeToggleButton
              label="System"
              icon={<ComputerDesktopIcon size={20} className={themeMode === 'system' ? 'text-white' : 'text-light-text dark:text-dark-text'} />}
              isActive={themeMode === 'system'}
              onPress={() => handleThemeChange('system')}
            />
          </View>
        </SettingsSection>

        {/* --- DISPLAY SECTION (RESTORED) --- */}
        <SettingsSection title="Display">
          <View className="flex-row items-center justify-between py-2">
            <Text className="font-body text-base text-light-text dark:text-dark-text">Image Quality</Text>
            {preferences && (
              <SegmentedControl
                options={['Medium', 'High']}
                selectedValue={preferences.imageQuality}
                onValueChange={(value) => updatePreference('imageQuality', value)}
              />
            )}
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="font-body text-base text-light-text dark:text-dark-text">Grid Columns</Text>
            {preferences && (
              <SegmentedControl
                options={['2', '3']}
                selectedValue={String(preferences.gridColumns)}
                onValueChange={(value) => updatePreference('gridColumns', Number(value))}
              />
            )}
          </View>
        </SettingsSection>

        {/* Storage Section */}
        <SettingsSection title="Storage">
          <SettingsRow
            icon={<TrashIcon size={22} className="text-light-text dark:text-dark-text" />}
            label="Clear Image Cache"
            onPress={handleClearCache}
          />
          <SettingsRow
            icon={<TrashIcon size={22} className="text-red-500" />}
            label="Clear Downloads"
            onPress={handleClearDownloads}
            destructive
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsRow
            icon={<InformationCircleIcon size={22} className="text-light-text dark:text-dark-text" />}
            label="Version"
            value="1.0.0"
          />
          <SettingsRow
            icon={<PhotoIcon size={22} className="text-light-text dark:text-dark-text" />}
            label="Images via Pixabay"
          />
           <SettingsRow
            icon={<CodeBracketIcon size={22} className="text-light-text dark:text-dark-text" />}
            label="Made by XEROCANVAS"
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}