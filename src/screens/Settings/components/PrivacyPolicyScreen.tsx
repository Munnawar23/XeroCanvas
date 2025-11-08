import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import { Header } from '@components/ui/Header';

export default function PrivacyPolicyScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation();

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      <Header
        title="Privacy Policy"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-subtext dark:text-dark-subtext mb-6">
          Last updated: November 8, 2025
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          1. Information We Collect
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          XeroCanvas does not collect, store, or transmit any personal information. All data, including your favourite wallpapers and theme preferences, is stored locally on your device.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          2. Third-Party Services
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          This app uses the Pixabay API to fetch wallpaper content. When you use the app, requests are made to Pixabay's servers. Please refer to Pixabay's Privacy Policy for information about how they handle data.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          3. Local Storage
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          The app stores the following data locally on your device:
          {'\n'}- Your favourite wallpapers
          {'\n'}- Theme preference (light or dark mode)
          {'\n'}- Search history and filters
          {'\n\n'}This data never leaves your device and can be cleared at any time from the Settings screen.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          4. Internet Connection
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          An active internet connection is required to browse and download wallpapers. The app will display an offline message when no connection is available.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          5. Downloaded Images
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          When you download a wallpaper, it is saved to your device's photo library. XeroCanvas does not have access to your photo library beyond saving the downloaded image.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          6. Analytics
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          XeroCanvas does not use any analytics or tracking services. We do not monitor your usage or collect any behavioral data.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          7. Children's Privacy
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          This app does not knowingly collect any information from children under the age of 13. The app is suitable for all ages.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          8. Changes to This Policy
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </Text>

        <Text className="text-lg font-semibold text-text dark:text-dark-text mb-3">
          9. Contact Us
        </Text>
        <Text className="text-base text-text dark:text-dark-text mb-6 leading-6">
          If you have any questions about this Privacy Policy, please contact us through the app's support channels.
        </Text>

        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
