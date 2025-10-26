import React from 'react'; 
import { View, Text, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

/**
 * Props for the CategoryCard component.
 */
type CategoryCardProps = {
  /** The name of the category to display. */
  category: string;
  /** The URL for the background image of the card. */
  imageUrl: string | null;
  /** The function to call when the card is pressed. */
  onPress: () => void;
};

/**
 * A memoized card component to display a single category.
 * Features a press-in animation and displays a title over a background image.
 * If no image is available, it shows a placeholder background.
 */
export const CategoryCard = React.memo(({ category, imageUrl, onPress }: CategoryCardProps) => {
  // Shared value for the press animation
  const scale = useSharedValue(1);

  // Animated style to apply the scale transformation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // --- Animation and Haptic Feedback Handlers ---

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  const handlePress = () => {
    HapticFeedback.trigger('impactLight');
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // Use theme-aware card and border colors
        className="aspect-square overflow-hidden rounded-xl bg-card dark:bg-dark-card"
      >
        {/* Conditional rendering for the background image or placeholder */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full bg-border dark:bg-dark-border" />
        )}
        
        {/* Gradient overlay to ensure text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          className="absolute bottom-0 left-0 right-0 h-2/3 justify-end p-3"
        >
          <Text
            className="text-center font-heading text-lg text-white"
            numberOfLines={1}
          >
            {/* Capitalize the first letter of the category name */}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
});