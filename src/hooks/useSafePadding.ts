import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafePadding = (extraTop = 10, extraBottom = 0) => {
  const { top, bottom, left, right } = useSafeAreaInsets();

  return {
    paddingTop: top > 0 ? top + extraTop : 30,
    paddingBottom: bottom + extraBottom,
    paddingLeft: left,
    paddingRight: right,
  };
};
