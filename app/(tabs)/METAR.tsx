import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";

export default function METAR() {
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral justify-center items-center"></View>
    </SafeAreaView>
  );
}
