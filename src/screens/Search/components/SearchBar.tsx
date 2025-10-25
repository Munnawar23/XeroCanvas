import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

type SearchBarProps = {
  /** The current value of the search input. */
  searchQuery: string;
  /** Callback function when the search text changes. */
  onSearchQueryChange: (text: string) => void;
  /** Callback function when the clear button is pressed. */
  onClearSearch: () => void;
  /** Callback function when the filter button is pressed. */
  onFilterPress: () => void;
};

export const SearchBar = React.memo(
  ({ searchQuery, onSearchQueryChange, onClearSearch, onFilterPress }: SearchBarProps) => {
    return (
      <View className="flex-row items-center gap-x-2 px-4 pb-3">
        {/* Search Input Area */}
        <View className="flex-1 flex-row items-center rounded-xl bg-card p-3">
          <MagnifyingGlassIcon size={20} className="text-subtext" />
          <TextInput
            placeholder="Search for wallpapers..."
            placeholderTextColor="#64748B" 
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            className="flex-1 px-2 font-body text-base text-text"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={onClearSearch}>
              <XMarkIcon size={20} className="text-subtext" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity onPress={onFilterPress} className="rounded-xl bg-accent p-3">
          <AdjustmentsHorizontalIcon size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
);