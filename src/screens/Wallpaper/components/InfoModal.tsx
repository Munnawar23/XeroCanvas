import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon, HeartIcon } from 'react-native-heroicons/outline';
import { PixabayImage } from '@api/index';

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  wallpaper: PixabayImage;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm text-subtext">{label}</Text>
    <Text className="font-medium text-text">{value}</Text>
  </View>
);

const StatRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View className="mb-3 flex-row items-center">
    <View className="w-6">{icon}</View>
    <Text className="ml-2 text-text">{text}</Text>
  </View>
);

export const InfoModal = ({ visible, onClose, wallpaper }: InfoModalProps) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/50">
      <Animated.View
        entering={FadeInUp.duration(300)}
        exiting={FadeOutDown.duration(300)}
        className="max-h-[60%] rounded-t-2xl bg-card"
      >
        <View className="flex-row items-center justify-between border-b border-border p-4">
          <Text className="font-heading text-xl text-text">Details</Text>
          <TouchableOpacity onPress={onClose}>
            <XMarkIcon size={24} className="text-text" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <InfoRow label="Photographer" value={wallpaper.user} />
          <InfoRow label="Dimensions" value={`${wallpaper.imageWidth} x ${wallpaper.imageHeight}`} />
          <StatRow
            icon={<EyeIcon size={20} className="text-subtext" />}
            text={`${wallpaper.views.toLocaleString()} views`}
          />
          <StatRow
            icon={<ArrowDownTrayIcon size={20} className="text-subtext" />}
            text={`${wallpaper.downloads.toLocaleString()} downloads`}
          />
          <StatRow
            icon={<HeartIcon size={20} className="text-subtext" />}
            text={`${wallpaper.likes.toLocaleString()} likes`}
          />
          <InfoRow label="Tags" value={wallpaper.tags} />
        </ScrollView>
      </Animated.View>
    </View>
  </Modal>
);