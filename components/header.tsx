import React from "react";
import ThemedTextBold from "./themed-bold";
import { Image, View } from "react-native";
export default function Header() {
  return (
    <View className="flex flex-row justify-start items-center w-full gap-2 bg-white h-20 pl-4">
      <Image
        source={require("../assets/logo/logo-no-bg.png")}
        height={24}
        width={24}
        className="w-6 h-6"
      />
      <ThemedTextBold styles="text-brand text-2xl">MetarCheck</ThemedTextBold>
    </View>
  );
}
