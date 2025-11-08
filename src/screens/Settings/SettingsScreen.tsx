import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Share, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import {
  SunIcon,
  MoonIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  TrashIcon,
  EyeSlashIcon,
  ServerStackIcon,
  ShareIcon,
  CheckCircleIcon,
  LifebuoyIcon,
} from 'react-native-heroicons/outline';
import { SettingsOption } from './components/SettingsOption';
import { SettingsToggle } from './components/SettingsToggle';
import { useFavouritesStore } from '@store/FavouritesStore';
import { SettingsStore } from '@store/SettingsStore';
import { ThemeStore } from '@store/ThemeStore';
import Toast from 'react-native-toast-message';
import { useColorScheme } from 'nativewind';
import ReactNativeBlobUtil from 'react-native-blob-util';
import HapticFeedback from 'react-native-haptic-feedback';

export default function SettingsScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<any>();
  const clearAllFavourites = useFavouritesStore(state => state.clearAll);
  const favouritesCount = useFavouritesStore(state => state.favourites.length);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [safeSearch, setSafeSearch] = useState(false);

  const iconColor = colorScheme === 'dark' ? '#FF6B35' : '#D4A574';
  const dangerIconColor = colorScheme === 'dark' ? '#EF4444' : '#DC2626';
  const checkColor = colorScheme === 'dark' ? '#10B981' : '#059669';

  // Load safe search preference on mount
  useEffect(() => {
    SettingsStore.getSafeSearch().then(setSafeSearch);
  }, []);

  const handleSafeSearchToggle = async (value: boolean) => {
    setSafeSearch(value);
    await SettingsStore.setSafeSearch(value);
    Toast.show({
      type: 'success',
      text1: value ? 'Safe Search Enabled' : 'Safe Search Disabled',
      position: 'top',
    });
  };

  const handleClearFavourites = () => {
    Alert.alert(
      'Clear All Favourites',
      `Are you sure you want to remove all ${favouritesCount} favourite${favouritesCount !== 1 ? 's' : ''}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearAllFavourites();
            Toast.show({
              type: 'success',
              text1: 'Favourites Cleared',
              text2: 'All favourites have been removed',
              position: 'top',
            });
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Image Cache',
      'This will free up storage space by removing cached images. You may need to reload images when browsing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const cacheDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
              const files = await ReactNativeBlobUtil.fs.ls(cacheDir);
              
              // Delete image cache files
              for (const file of files) {
                if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')) {
                  await ReactNativeBlobUtil.fs.unlink(`${cacheDir}/${file}`);
                }
              }
              
              Toast.show({
                type: 'success',
                text1: 'Cache Cleared',
                text2: 'Image cache has been cleared',
                position: 'top',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear cache',
                position: 'top',
              });
            }
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out XeroCanvas - Discover stunning wallpapers! Download now: https://xerocanvas.app',
        title: 'XeroCanvas - Beautiful Wallpapers',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleThemeSelect = async (theme: 'light' | 'dark') => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setColorScheme(theme);
    await ThemeStore.setTheme(theme);
  };

  const handleSupportPress = () => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Linking.openURL('mailto:munawwarh48@gmail.com');
  };

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-3xl font-heading text-text dark:text-dark-text">
          Settings
        </Text>
      </View>

      {/* Settings Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* 1. Appearance Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-2">
          APPEARANCE
        </Text>
        
        {/* Theme Cards */}
        <View className="flex-row gap-x-4 mb-3">
          {/* Light Theme */}
          <TouchableOpacity
            onPress={() => handleThemeSelect('light')}
            className={`flex-1 bg-card dark:bg-dark-card rounded-2xl p-5 items-center border-2 ${
              colorScheme === 'light'
                ? 'border-accent dark:border-dark-accent'
                : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <View className="bg-accent/20 dark:bg-dark-accent/20 p-3 rounded-full mb-3">
              <SunIcon size={28} color={iconColor} />
            </View>
            <Text className="text-base font-semibold text-text dark:text-dark-text mb-2">
              Light
            </Text>
            {colorScheme === 'light' && (
              <CheckCircleIcon size={20} color={checkColor} />
            )}
          </TouchableOpacity>

          {/* Dark Theme */}
          <TouchableOpacity
            onPress={() => handleThemeSelect('dark')}
            className={`flex-1 bg-card dark:bg-dark-card rounded-2xl p-5 items-center border-2 ${
              colorScheme === 'dark'
                ? 'border-accent dark:border-dark-accent'
                : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <View className="bg-accent/20 dark:bg-dark-accent/20 p-3 rounded-full mb-3">
              <MoonIcon size={28} color={iconColor} />
            </View>
            <Text className="text-base font-semibold text-text dark:text-dark-text mb-2">
              Dark
            </Text>
            {colorScheme === 'dark' && (
              <CheckCircleIcon size={20} color={checkColor} />
            )}
          </TouchableOpacity>
        </View>

        {/* 2. Safe Search Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-6">
          SAFE SEARCH
        </Text>
        <SettingsToggle
          icon={<EyeSlashIcon size={24} color={iconColor} />}
          title="Safe Search"
          subtitle={safeSearch ? 'Filtering adult content' : 'No content filtering'}
          value={safeSearch}
          onValueChange={handleSafeSearchToggle}
        />

           {/* 3. Storage Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-6">
          STORAGE
        </Text>
        <SettingsOption
          icon={<ServerStackIcon size={24} color={dangerIconColor} />}
          title="Clear Image Cache"
          subtitle="Free up storage space"
          onPress={handleClearCache}
          showChevron={false}
          danger
        />
        <SettingsOption
          icon={<TrashIcon size={24} color={dangerIconColor} />}
          title="Clear All Favourites"
          subtitle={`${favouritesCount} favourite${favouritesCount !== 1 ? 's' : ''} saved`}
          onPress={handleClearFavourites}
          showChevron={false}
          danger
        />

        {/* 4. Community Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-6">
          COMMUNITY
        </Text>
        <SettingsOption
          icon={<ShareIcon size={24} color={iconColor} />}
          title="Share App"
          subtitle="Share with friends and family"
          onPress={handleShareApp}
          showChevron={false}
        />

        <SettingsOption
          icon={<LifebuoyIcon size={24} color={iconColor} />}
          title="Help & Support"
          subtitle="Contact us at munawwarh48@gmail.com"
          onPress={handleSupportPress}
          showChevron={false}
        />

        {/* 5. Legal Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-6">
          LEGAL
        </Text>
        <SettingsOption
          icon={<DocumentTextIcon size={24} color={iconColor} />}
          title="Terms & Conditions"
          onPress={() => navigation.navigate('TermsConditions')}
        />
        <SettingsOption
          icon={<ShieldCheckIcon size={24} color={iconColor} />}
          title="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />

        {/* 6. About Section */}
        <Text className="text-sm font-semibold text-subtext dark:text-dark-subtext mb-3 mt-6">
          ABOUT
        </Text>
        <SettingsOption
          icon={<InformationCircleIcon size={24} color={iconColor} />}
          title="About"
          subtitle="Learn more about this app"
          onPress={() => navigation.navigate('About')}
        />

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
