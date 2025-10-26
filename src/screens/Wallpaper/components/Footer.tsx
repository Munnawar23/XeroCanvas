import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';

type FooterProps = {
  onDummyAction: () => void;
  onDownload: () => void;
  downloading: boolean;
};

export const Footer: React.FC<FooterProps> = React.memo(
  ({ onDummyAction, onDownload, downloading }) => (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      className="absolute bottom-0 w-full p-4 pb-12"
    >
      <View className="flex-row items-center gap-x-4">
        {/* Dummy button */}
        <TouchableOpacity
          onPress={onDummyAction}
          className="h-14 w-14 items-center justify-center rounded-full bg-white/20"
        >
          <ArrowDownTrayIcon size={28} color="white" />
        </TouchableOpacity>

        {/* Set Wallpaper button */}
        <TouchableOpacity
          onPress={onDownload}
          disabled={downloading}
          className="flex-1 flex-row items-center justify-center gap-x-3 rounded-full bg-accent py-4"
        >
          {downloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <ArrowDownTrayIcon size={24} color="white" />
              <Text className="font-heading text-lg text-white">Set Wallpaper</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
);
