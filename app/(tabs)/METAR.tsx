import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import InfoCard from "@/components/info-card";
import Thermo from "@/assets/icons/thermo";

export default function METAR() {
  const { metar } = useLocalSearchParams();
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral justify-center items-center">
        <InfoCard
          title="TEMPERATURE & DEWPOINT"
          r1_title="Humidity"
          icon={<Thermo></Thermo>}
          r1_value={68}
          r2_title="QNH (Altimeter)"
          r2_value={1013}
        ></InfoCard>
      </View>
    </SafeAreaView>
  );
}
