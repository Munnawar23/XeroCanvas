import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon, HeartIcon } from 'react-native-heroicons/outline';
import { PixabayImage } from '@api/index';
import { useColorScheme } from 'nativewind';

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  wallpaper: PixabayImage;
};

/**
 * A reusable row for displaying a label and its value.
 */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm text-subtext dark:text-dark-subtext">{label}</Text>
    <Text className="font-medium text-text dark:text-dark-text">{value}</Text>
  </View>
);

/**
 * A reusable row for displaying an icon and a piece of statistical data.
 */
const StatRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View className="mb-3 flex-row items-center">
    <View className="w-6">{icon}</View>
    <Text className="ml-2 text-text dark:text-dark-text">{text}</Text>
  </View>
);

/**
 * A modal that displays detailed information and statistics about a wallpaper.
 */
export const InfoModal = ({ visible, onClose, wallpaper }: InfoModalProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Define icon colors based on the current theme
  const subtextIconColor = isDarkMode ? '#9CA3AF' : '#64748B'; // subtext color
  const textIconColor = isDarkMode ? '#F1F5F9' : '#1E293B';    // text color

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutDown.duration(300)}
          className="max-h-[60%] rounded-t-2xl bg-card dark:bg-dark-card"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between border-b border-border dark:border-dark-border p-4">
            <Text className="font-heading text-xl text-text dark:text-dark-text">Details</Text>
            <TouchableOpacity onPress={onClose}>
              <XMarkIcon size={24} color={textIconColor} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <InfoRow label="Photographer" value={wallpaper.user} />
            <InfoRow label="Dimensions" value={`${wallpaper.imageWidth} x ${wallpaper.imageHeight}`} />
            {/* Statistics */}
            <StatRow
              icon={<EyeIcon size={20} color={subtextIconColor} />}
              text={`${wallpaper.views.toLocaleString()} views`}
            />
            <StatRow
              icon={<ArrowDownTrayIcon size={20} color={subtextIconColor} />}
              text={`${wallpaper.downloads.toLocaleString()} downloads`}
            />
            <StatRow
              icon={<HeartIcon size={20} color={subtextIconColor} />}
              text={`${wallpaper.likes.toLocaleString()} likes`}
            />
            {/* Tags */}
            <InfoRow label="Tags" value={wallpaper.tags} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};