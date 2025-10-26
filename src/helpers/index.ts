import { Dimensions } from "react-native";

// Device width and height
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

/**
 * Calculate width percentage relative to device width.
 */
export const wp = (percentage: number) => (percentage * deviceWidth) / 100;

/**
 * Calculate height percentage relative to device height.
 */
export const hp = (percentage: number) => (percentage * deviceHeight) / 100;
