import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { wp, hp } from "@helpers/index";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-accent rounded-xl justify-center items-center"
      style={{ width: wp(85), height: hp(6) }}
    >
      <Text className="text-white font-semibold text-xl">{title}</Text>
    </TouchableOpacity>
  );
}