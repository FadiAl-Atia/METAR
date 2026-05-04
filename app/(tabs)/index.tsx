import { Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";

export default function index() {
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral pl-4 justify-center items-center">
        <Text className="text-green-500 font-[Mono]">hello</Text>
      </View>
    </SafeAreaView>
  );
}
