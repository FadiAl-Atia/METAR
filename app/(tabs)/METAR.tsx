import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import InfoCard from "@/components/info-card";
import Thermo from "@/assets/icons/thermo";
import ThemedTextBold from "@/components/themed-bold";
import ThemedText from "@/components/themed";
import Globe from "@/assets/icons/globe";

export default function METAR() {
  const { metar } = useLocalSearchParams();
  const metarParsed = JSON.parse(metar.toString());
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header></Header>
      {metar ? (
        <View className="flex-1 bg-text-nuetral px-6 mt-4">
          {/*Airport Information */}
          <ThemedText styles="text-[32px]">
            {metarParsed.data[0].station.icao}
          </ThemedText>
          <ThemedText styles="mb-4">
            {metarParsed.data[0].station.name}
          </ThemedText>
          {/*Flight Category */}

          {/*Weather*/}
          <View className="p-4 bg-white gap-4 w-4/5 rounded-lg shadow-lg shadow-black/20 self-center"></View>
          <InfoCard
            title="TEMPERATURE & DEWPOINT"
            r1_title="Humidity"
            icon={<Thermo />}
            r1_value={68}
            r2_title="QNH (Altimeter)"
            r2_value={1013}
          />
        </View>
      ) : (
        <View className="flex-1 bg-text-nuetral justify-center items-center">
          <ThemedTextBold styles="text-center">
            Please search for an airport to view their METAR.
          </ThemedTextBold>
        </View>
      )}
    </SafeAreaView>
  );
}
