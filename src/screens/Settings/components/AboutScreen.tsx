import React from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import { Header } from '@components/ui/Header';
import { ArrowTopRightOnSquareIcon } from 'react-native-heroicons/outline';
import { useColorScheme } from 'nativewind';
import HapticFeedback from 'react-native-haptic-feedback';

export default function AboutScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();

  const linkColor = colorScheme === 'dark' ? '#60A5FA' : '#3B82F6';

  const openLink = (url: string) => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Linking.openURL(url);
  };

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      <Header
        title="About"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View className="items-center mb-8 mt-5">
          <Text className="text-4xl font-heading text-text dark:text-dark-text mb-2">
            XeroCanvas
          </Text>
          <Text className="text-base text-subtext dark:text-dark-subtext">
            Version 1.0.0
          </Text>
        </View>

        {/* Description */}
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          XeroCanvas is a beautiful wallpaper discovery app that brings you stunning, high-quality images from around the world. Browse, search, and download wallpapers to personalize your device.
        </Text>

        {/* Powered By Section */}
        <View className="bg-card dark:bg-dark-card rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
            Powered by Pixabay
          </Text>
          <Text className="text-base text-text dark:text-dark-text mb-4 leading-6">
            All wallpapers in this app are provided by Pixabay, a vibrant community of creatives sharing copyright-free images and videos.
          </Text>
          <TouchableOpacity
            onPress={() => openLink('https://pixabay.com')}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold mr-2" style={{ color: linkColor }}>
              Visit Pixabay
            </Text>
            <ArrowTopRightOnSquareIcon size={18} color={linkColor} />
          </TouchableOpacity>
        </View>

        {/* API Information */}
        <View className="bg-card dark:bg-dark-card rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
            Pixabay API
          </Text>
          <Text className="text-base text-text dark:text-dark-text mb-4 leading-6">
            This app uses the Pixabay API to fetch and display wallpapers. The API provides access to over 2.8 million high-quality stock images, videos, and music shared by the Pixabay community.
          </Text>
          <Text className="text-base text-text dark:text-dark-text mb-4 leading-6">
            Features powered by Pixabay API:
            {'\n'}- Search millions of free images
            {'\n'}- Filter by color, orientation, and category
            {'\n'}- Access editor's choice collections
            {'\n'}- High-resolution downloads
          </Text>
          <TouchableOpacity
            onPress={() => openLink('https://pixabay.com/api/docs/')}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold mr-2" style={{ color: linkColor }}>
              API Documentation
            </Text>
            <ArrowTopRightOnSquareIcon size={18} color={linkColor} />
          </TouchableOpacity>
        </View>

        {/* License Information */}
        <View className="bg-card dark:bg-dark-card rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
            Content License
          </Text>
          <Text className="text-base text-text dark:text-dark-text mb-4 leading-6">
            All images on Pixabay are released under the Pixabay License, which makes them safe to use without asking for permission or giving credit to the artist - even for commercial purposes.
          </Text>
          <TouchableOpacity
            onPress={() => openLink('https://pixabay.com/service/license/')}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold mr-2" style={{ color: linkColor }}>
              View License
            </Text>
            <ArrowTopRightOnSquareIcon size={18} color={linkColor} />
          </TouchableOpacity>
        </View>
        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
