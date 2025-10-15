// src/components/FilterModal.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { COLOR_FILTERS } from '@services/pixabay';

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

export const FilterModal = ({ visible, onClose, initialFilters, onApply }: FilterModalProps) => {
  // Local state to track changes without affecting the search until "Apply" is pressed
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync local state if the initial filters from the parent screen change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

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

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Animated.View 
          entering={FadeInUp.duration(300)} 
          exiting={FadeOutDown.duration(300)}
          className="max-h-[80%] rounded-t-2xl bg-light-card dark:bg-dark-card"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between border-b border-light-border p-4 dark:border-dark-border">
            <Text className="font-heading text-xl text-light-text dark:text-dark-text">Filters</Text>
            <TouchableOpacity onPress={onClose}><XMarkIcon size={24} className="text-light-text dark:text-dark-text" /></TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Sort Order */}
            <Text className="mb-3 font-medium text-light-text dark:text-dark-text">Sort By</Text>
            <View className="flex-row space-x-2">
              {['Popular', 'Latest'].map(order => (
                <TouchableOpacity key={order} onPress={() => setFilters(prev => ({ ...prev, order: order.toLowerCase() as any }))}
                  className={`flex-1 items-center rounded-lg py-2 ${filters.order === order.toLowerCase() ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-background dark:bg-dark-background'}`}>
                  <Text className={`font-medium ${filters.order === order.toLowerCase() ? 'text-white' : 'text-light-text dark:text-dark-text'}`}>{order}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Colors */}
            <Text className="mb-3 mt-5 font-medium text-light-text dark:text-dark-text">Colors</Text>
            <View className="flex-row flex-wrap gap-2">
              {COLOR_FILTERS.map(color => (
                <TouchableOpacity key={color} onPress={() => handleColorToggle(color)}
                  className={`rounded-full border px-4 py-1 ${filters.colors.includes(color) ? 'border-light-accent bg-light-accent dark:border-dark-accent dark:bg-dark-accent' : 'border-light-border bg-transparent dark:border-dark-border'}`}>
                  <Text className={`capitalize ${filters.colors.includes(color) ? 'text-white' : 'text-light-text dark:text-dark-text'}`}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="font-medium text-light-text dark:text-dark-text">Editor's Choice</Text>
              <Switch value={filters.editorsChoice} onValueChange={v => setFilters(prev => ({ ...prev, editorsChoice: v }))} />
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View className="flex-row gap-x-3 border-t border-light-border p-4 dark:border-dark-border">
            <TouchableOpacity onPress={handleReset} className="flex-1 items-center rounded-xl border border-light-border py-3 dark:border-dark-border"><Text className="font-heading text-light-text dark:text-dark-text">Reset</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleApply} className="flex-1 items-center rounded-xl bg-light-accent py-3 dark:bg-dark-accent"><Text className="font-heading text-white">Apply</Text></TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};