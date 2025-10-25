import React from "react";
import { View, Text, StatusBar, RefreshControl } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { useSafePadding } from "@hooks/useSafePadding";
import { useDownloads } from "@screens/Downloads/hooks/useDownloads"; 
import { DownloadedWallpaper } from "@utils/storage";
import { LoadingState } from "@components/layout/LoadingState"; 
import { DownloadedWallpaperCard } from "@screens/Downloads/components/DownloadedWallpaperCard";
import { EmptyState } from "@screens/Downloads/components/EmptyState"; 

export default function DownloadsScreen() {
  const { paddingTop } = useSafePadding();
  
  const { downloads, loading, refreshing, handleDelete, handleRefresh } = useDownloads();

  const renderItem: ListRenderItem<DownloadedWallpaper> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <DownloadedWallpaperCard
        item={item}
        onDelete={() => handleDelete(item.id)}
      />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingState paddingTop={0} />;
    }
    if (downloads.length === 0) {
      return <EmptyState />;
    }
    return (
      <FlashList<DownloadedWallpaper>
        data={downloads}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        masonry
        contentContainerStyle={{ paddingHorizontal: 4 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#64748B" />
        }
      />
    );
  };

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text">My Downloads</Text>
      </View>
      {renderContent()}
    </View>
  );
}