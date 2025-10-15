// src/components/InfoModal.tsx
import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon, HeartIcon } from 'react-native-heroicons/outline';
import { PixabayImage } from '@services/pixabay';

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  wallpaper: PixabayImage;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-4"><Text className="mb-1 text-sm text-light-subtext dark:text-dark-subtext">{label}</Text><Text className="font-medium text-light-text dark:text-dark-text">{value}</Text></View>
);

const StatRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View className="mb-3 flex-row items-center"><View className="w-6">{icon}</View><Text className="ml-2 text-light-text dark:text-dark-text">{text}</Text></View>
);

export const InfoModal = ({ visible, onClose, wallpaper }: InfoModalProps) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/50">
      <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutDown.duration(300)} className="max-h-[60%] rounded-t-2xl bg-light-card dark:bg-dark-card">
        <View className="flex-row items-center justify-between border-b border-light-border p-4 dark:border-dark-border">
          <Text className="font-heading text-xl text-light-text dark:text-dark-text">Details</Text>
          <TouchableOpacity onPress={onClose}><XMarkIcon size={24} className="text-light-text dark:text-dark-text" /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <InfoRow label="Photographer" value={wallpaper.user} />
          <InfoRow label="Dimensions" value={`${wallpaper.imageWidth} x ${wallpaper.imageHeight}`} />
          <StatRow icon={<EyeIcon size={20} className="text-light-subtext dark:text-dark-subtext" />} text={`${wallpaper.views.toLocaleString()} views`} />
          <StatRow icon={<ArrowDownTrayIcon size={20} className="text-light-subtext dark:text-dark-subtext" />} text={`${wallpaper.downloads.toLocaleString()} downloads`} />
          <StatRow icon={<HeartIcon size={20} className="text-light-subtext dark:text-dark-subtext" />} text={`${wallpaper.likes.toLocaleString()} likes`} />
          <InfoRow label="Tags" value={wallpaper.tags} />
        </ScrollView>
      </Animated.View>
    </View>
  </Modal>
);