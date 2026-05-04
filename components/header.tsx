import React from "react";
import ThemedTextBold from "./themed-bold";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaneTakeoff } from "lucide-react-native";
import { Text, View } from "react-native";
export default function Header() {
  return (
    <View className="flex flex-row justify-start items-center w-full gap-2 bg-white h-20 pl-4">
      <PlaneTakeoff
        size={24}
        color={"#1a2e4a"}
        fill={"#1a2e4a"}
        strokeWidth={1}
      ></PlaneTakeoff>
      <ThemedTextBold styles="text-brand text-2xl">MetarCheck</ThemedTextBold>
    </View>
  );
}
