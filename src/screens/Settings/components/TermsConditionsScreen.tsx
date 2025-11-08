import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import { Header } from '@components/ui/Header';

export default function TermsConditionsScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation();

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      <Header
        title="Terms & Conditions"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-subtext dark:text-dark-subtext mb-6">
          Last updated: November 8, 2025
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          1. Acceptance of Terms
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          By accessing and using XeroCanvas, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          2. Use License
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          Permission is granted to temporarily download wallpapers from XeroCanvas for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          3. Content Attribution
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          All wallpapers are provided by Pixabay API. Users must comply with Pixabay's license terms when using downloaded content. XeroCanvas does not claim ownership of any images displayed in the app.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          4. User Responsibilities
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          You are responsible for maintaining the confidentiality of your device and for all activities that occur under your usage. You agree to use the app only for lawful purposes.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          5. Disclaimer
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          The materials in XeroCanvas are provided on an 'as is' basis. XeroCanvas makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          6. Limitations
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          In no event shall XeroCanvas or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use XeroCanvas.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          7. Modifications
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          XeroCanvas may revise these terms of service at any time without notice. By using this app, you are agreeing to be bound by the then current version of these terms of service.
        </Text>

        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
