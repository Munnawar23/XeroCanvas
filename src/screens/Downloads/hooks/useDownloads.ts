import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import { storage, DownloadedWallpaper } from '@utils/storage';

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadedWallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadDownloads = useCallback(async () => {
    try {
      const data = await storage.getDownloads();
      setDownloads(data);
    } catch (error) {
      console.error("Failed to load downloads:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      loadDownloads();
    }
  }, [isFocused, loadDownloads]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDownloads();
  }, [loadDownloads]);

  const handleDelete = useCallback((id: string) => {
    HapticFeedback.trigger('impactMedium');
    Alert.alert(
      'Delete Wallpaper',
      'Are you sure you want to delete this downloaded wallpaper?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDownloads(prev => prev.filter(d => d.id !== id));
            await storage.removeDownload(id);
          },
        },
      ]
    );
  }, []);

  return {
    downloads,
    loading,
    refreshing,
    handleDelete,
    handleRefresh,
  };
};