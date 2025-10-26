import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { useColorScheme } from 'nativewind';

type SearchBarProps = {
  searchQuery: string;
  onSearchQueryChange: (text: string) => void;
  onClearSearch: () => void;
  onFilterPress: () => void;
};

/**
 * A memoized search bar component with integrated clear and filter buttons.
 */
export const SearchBar = React.memo(
  ({ searchQuery, onSearchQueryChange, onClearSearch, onFilterPress }: SearchBarProps) => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Define theme-aware colors for icons and placeholder text
    const placeholderColor = isDarkMode ? '#9CA3AF' : '#64748B'; // subtext color
    const iconColor = placeholderColor;

    return (
      <View className="flex-row items-center gap-x-2 px-4 pb-3">
        {/* Search Input Area */}
        <View className="flex-1 flex-row items-center rounded-xl bg-card dark:bg-dark-card p-3">
          <MagnifyingGlassIcon size={20} color={iconColor} />
          <TextInput
            placeholder="Search for wallpapers..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            className="flex-1 px-2 font-body text-base text-text dark:text-dark-text"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={onClearSearch}>
              <XMarkIcon size={20} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity onPress={onFilterPress} className="rounded-xl bg-accent dark:bg-dark-accent p-3">
          <AdjustmentsHorizontalIcon size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
);