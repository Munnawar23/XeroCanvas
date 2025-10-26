import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { COLOR_FILTERS } from '@api/index';
import { useColorScheme } from 'nativewind';

// Define the shape of the filters state object
export type FilterState = {
  colors: string[];
  editorsChoice: boolean;
  order: 'popular' | 'latest';
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  initialFilters: FilterState;
  onApply: (newFilters: FilterState) => void;
};

/**
 * A modal component for filtering search results.
 * Allows users to filter by sort order, color, and editor's choice.
 */
export const FilterModal = ({ visible, onClose, initialFilters, onApply }: FilterModalProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Local state to manage filter changes internally
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync local state if the parent's initial filters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // --- Handlers ---
  
  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleReset = () => {
    const defaultFilters = { colors: [], editorsChoice: false, order: 'popular' as const };
    setFilters(defaultFilters);
    onApply(defaultFilters);
    onClose();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };
  
  // --- Theme-aware colors ---
  const iconColor = isDarkMode ? '#F1F5F9' : '#1E293B';
  const switchThumbColor = Platform.OS === 'android' ? (isDarkMode ? '#60A5FA' : '#3B82F6') : undefined;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutDown.duration(300)}
          className="max-h-[80%] rounded-t-2xl bg-card dark:bg-dark-card"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between border-b border-border dark:border-dark-border p-4">
            <Text className="font-heading text-xl text-text dark:text-dark-text">Filters</Text>
            <TouchableOpacity onPress={onClose}><XMarkIcon size={24} color={iconColor} /></TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Sort Order */}
            <Text className="mb-3 font-medium text-text dark:text-dark-text">Sort By</Text>
            <View className="flex-row space-x-2">
              {['Popular', 'Latest'].map(order => (
                <TouchableOpacity key={order} onPress={() => setFilters(prev => ({ ...prev, order: order.toLowerCase() as any }))}
                  className={`flex-1 items-center rounded-lg py-2 ${filters.order === order.toLowerCase() ? 'bg-accent dark:bg-dark-accent' : 'bg-background dark:bg-dark-background'}`}>
                  <Text className={`font-medium ${filters.order === order.toLowerCase() ? 'text-white' : 'text-text dark:text-dark-text'}`}>{order}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Colors */}
            <Text className="mb-3 mt-5 font-medium text-text dark:text-dark-text">Colors</Text>
            <View className="flex-row flex-wrap gap-2">
              {COLOR_FILTERS.map(color => (
                <TouchableOpacity key={color} onPress={() => handleColorToggle(color)}
                  className={`rounded-full border px-4 py-1 ${filters.colors.includes(color) ? 'border-accent dark:border-dark-accent bg-accent dark:bg-dark-accent' : 'border-border dark:border-dark-border bg-transparent'}`}>
                  <Text className={`capitalize ${filters.colors.includes(color) ? 'text-white' : 'text-text dark:text-dark-text'}`}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="font-medium text-text dark:text-dark-text">Editor's Choice</Text>
              <Switch 
                value={filters.editorsChoice} 
                onValueChange={v => setFilters(prev => ({ ...prev, editorsChoice: v }))}
                trackColor={{ false: isDarkMode ? '#374151' : '#E5E7EB', true: isDarkMode ? '#60A5FA' : '#3B82F6' }}
                thumbColor={switchThumbColor}
              />
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View className="flex-row gap-x-3 border-t border-border dark:border-dark-border p-4">
            <TouchableOpacity onPress={handleReset} className="flex-1 items-center rounded-xl border border-border dark:border-dark-border py-3"><Text className="font-heading text-text dark:text-dark-text">Reset</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleApply} className="flex-1 items-center rounded-xl bg-accent dark:bg-dark-accent py-3"><Text className="font-heading text-white">Apply</Text></TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};