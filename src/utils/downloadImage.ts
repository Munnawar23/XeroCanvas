import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

/**
 * Download an image from a URL and save it to the gallery
 * @param imageUrl - URL of the image
 * @param fileName - Optional file name (default: wallpaper_TIMESTAMP.jpg)
 * @returns local URI of saved image
 */
export const downloadImage = async (imageUrl: string, fileName?: string) => {
  try {
    const name = fileName || `wallpaper_${Date.now()}.jpg`;
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const path = `${dirs.PictureDir}/${name}`;

    const res = await ReactNativeBlobUtil.config({
      fileCache: true,
      path, // use full path with file name
      appendExt: 'jpg',
    }).fetch('GET', imageUrl);

    const savedUri = await CameraRoll.save(res.path(), { type: 'photo' });
    return savedUri;
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
};
