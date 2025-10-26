import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';

type FooterProps = {
  onDummyAction: () => void;
  onDownload: () => void;
  downloading: boolean;
  /** Safe area padding from the bottom of the screen. */
  paddingBottom: number;
};

/**
 * The footer for the wallpaper detail screen.
 * Contains the primary action button to set or download the wallpaper.
 */
export const Footer: React.FC<FooterProps> = React.memo(
  ({ onDummyAction, onDownload, downloading, paddingBottom }) => (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      // Apply dynamic bottom padding to respect the device's safe area
      style={{ paddingBottom }}
      className="absolute bottom-0 w-full p-4"
    >
      <View className="flex-row items-center gap-x-4">
        {/* A placeholder button for future actions */}
        <TouchableOpacity
          onPress={onDummyAction}
          className="h-14 w-14 items-center justify-center rounded-full bg-white/20 active:opacity-70"
        >
          <ArrowDownTrayIcon size={28} color="white" />
        </TouchableOpacity>

        {/* 
          Primary "Set Wallpaper" button.
          Its styling has been updated to match the common Button component (accent font, rounded-xl shape)
          while retaining its icon and loading state functionality.
        */}
        <TouchableOpacity
          onPress={onDownload}
          disabled={downloading}
          // Use theme-aware accent colors and updated styling for consistency
          className="flex-1 flex-row items-center justify-center gap-x-3 rounded-xl bg-accent dark:bg-dark-accent py-4 active:opacity-80"
        >
          {downloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <ArrowDownTrayIcon size={24} color="white" />
              {/* Use the 'font-accent' from your common button */}
              <Text className="font-accent text-lg text-white">Set Wallpaper</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
);