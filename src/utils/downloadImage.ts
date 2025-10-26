import ReactNativeBlobUtil from 'react-native-blob-util';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

/**
 * Download an image from a URL and save it to the device gallery.
 */
export const downloadImage = async (imageUrl: string, fileName?: string) => {
  try {
    const name = fileName || `wallpaper_${Date.now()}.jpg`;
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const path = `${dirs.PictureDir}/${name}`;

    const res = await ReactNativeBlobUtil.config({
      fileCache: true,
      path,
      appendExt: 'jpg',
    }).fetch('GET', imageUrl);

    const savedUri = await CameraRoll.save(res.path(), { type: 'photo' });
    return savedUri;
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
};
