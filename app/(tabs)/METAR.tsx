import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import InfoCard from "@/components/info-card";
import Thermo from "@/assets/icons/thermo";
import ThemedTextBold from "@/components/themed-bold";
import ThemedText from "@/components/themed";
import Pressure from "@/assets/icons/pressure";
import Cloud from "@/assets/icons/cloud";
import { Copy, CopyIcon } from "lucide-react-native";

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
          <View
            className={`px-3 py-1 self-start justify-center items-center rounded-full mb-4 ${metarParsed.data[0].flight_category === "VFR" ? "bg-green-500" : "bg-red-500"}`}
          >
            <ThemedTextBold styles="text-black">
              {metarParsed.data[0].flight_category}
            </ThemedTextBold>
          </View>
          {/*Cards Container */}
          <View className="flex gap-4 w-full">
            {/*Temperature*/}
            <View className="p-4 bg-white gap-4 w-full rounded-lg shadow-lg shadow-black/20 ">
              <View className="flex flex-row justify-between px-2">
                <ThemedText>TEMPRATURE & DEWPOINT</ThemedText>
                <Thermo></Thermo>
              </View>
              <View className="flex flex-row w-full justify-around">
                <View className="p-2">
                  <ThemedText>Temp</ThemedText>
                  <ThemedText styles="text-[32px]">
                    {metarParsed.data[0].temperature.celsius}°C
                  </ThemedText>
                </View>
                <View className="p-2">
                  <ThemedText>Dewpoint</ThemedText>
                  <ThemedText styles="text-[32px]">
                    {metarParsed.data[0].dewpoint.celsius}°C
                  </ThemedText>
                </View>
              </View>
            </View>
            {/*Atmoshpere */}
            <InfoCard
              title="ATMOSPHERIC"
              r1_title="Humidity"
              icon={<Pressure />}
              r1_value={metarParsed.data[0].humidity}
              r2_title="QNH (Altimeter)"
              r2_value={metarParsed.data[0].pressure.mb}
            />
            {/*Visibility */}
            <InfoCard
              title="VISIBILITY & SKY"
              r1_title="Visibility"
              icon={<Cloud />}
              r1_value={metarParsed.data[0].visibility.miles}
              r2_title="Clouds"
              r2_value={`${metarParsed.data[0].clouds[0].code} ${metarParsed.data[0].clouds[0].feet}FT`}
            />
            {/*RAW Metar */}
            <View className="w-full">
              <View className="flex flex-row justify-between">
                <ThemedText>Raw METAR</ThemedText>
                <View className="flex flex-row items-center gap-2">
                  <CopyIcon color={"#1565C0"} />
                  <ThemedText styles="text-brand">COPY</ThemedText>
                </View>
              </View>
            </View>
          </View>
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
