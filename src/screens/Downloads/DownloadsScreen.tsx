import React from "react";
import { View, Text, Alert, StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import HapticFeedback from "react-native-haptic-feedback";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import LottieView from "lottie-react-native";

// Hooks, utils, and types
import { useSafePadding } from "@hooks/useSafePadding";
import { storage, DownloadedWallpaper } from "@utils/storage";

// Components
import { DownloadedWallpaperCard } from "@screens/Downloads/components/DownloadedWallpaperCard";

export default function DownloadsScreen() {
  const { paddingTop } = useSafePadding();
  const [downloads, setDownloads] = React.useState<DownloadedWallpaper[]>([]);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      loadDownloads();
    }
  }, [isFocused]);

  const loadDownloads = async () => {
    const data = await storage.getDownloads();
    setDownloads(data);
  };

  const handleDelete = (id: string) => {
    HapticFeedback.trigger("impactMedium");
    Alert.alert(
      "Delete Wallpaper",
      "Are you sure you want to delete this downloaded wallpaper?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storage.removeDownload(id);
            loadDownloads();
          },
        },
      ]
    );
  };

  const renderItem: ListRenderItem<DownloadedWallpaper> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <DownloadedWallpaperCard
        item={item}
        onDelete={() => handleDelete(item.id)}
      />
    </View>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <LottieView
        source={require("@assets/animations/empty.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
      <Text className="font-heading text-xl text-text">
        No Downloads Yet
      </Text>
      <Text className="text-center font-body text-subtext">
        Wallpapers you save will appear here for you to view and manage.
      </Text>
    </View>
  );

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="dark-content" />
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text">
          My Downloads
        </Text>
      </View>

      {downloads.length === 0 ? (
        <EmptyState />
      ) : (
        <FlashList<DownloadedWallpaper>
          data={downloads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          masonry
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      )}
    </View>
  );
}