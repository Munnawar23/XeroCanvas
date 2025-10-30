import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ArrowDownTrayIcon } from "react-native-heroicons/outline";
import { Button } from "@components/ui/Button";
import { wp } from "@helpers/index";

type FooterProps = {
  onDownload: () => void;
  downloading: boolean;
  paddingBottom: number;
};

export const Footer: React.FC<FooterProps> = React.memo(
  ({ onDownload, downloading, paddingBottom }) => (
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.8)"]}
      style={{ paddingBottom }}
      className="absolute bottom-0 w-full p-4"
    >
      <View className="flex-row items-center justify-center">
        <Button
          title={downloading ? "Downloading..." : "Download Wallpaper"}
          onPress={onDownload}
          disabled={downloading}
          icon={<ArrowDownTrayIcon size={24} color="white" />}
          width={wp(85)} 
        />
      </View>
    </LinearGradient>
  )
);
