import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { Plane } from "lucide-react-native";

export default function index() {
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral pl-4 justify-center items-center">
        <View className="h-16 w-16 bg-[#F1F5F9] flex justify-center items-center rounded-full">
          <Plane
            color={"#1565C0"}
            fill={"#1565C0"}
            strokeWidth={1}
            className="mb-[32px]"
          ></Plane>
        </View>
      </View>
    </SafeAreaView>
  );
}
