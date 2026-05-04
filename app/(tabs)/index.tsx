import { View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { Plane, Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import ThemedText from "@/components/themed";
import { Button, ButtonText } from "@/components/ui/button";

export default function index() {
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral justify-center items-center">
        <View className="h-16 w-16 bg-[#e6ebf0] flex justify-center items-center rounded-full mb-6 ">
          <Plane color={"#1565C0"} fill={"#1565C0"} strokeWidth={1}></Plane>
        </View>
        <Input
          variant="rounded"
          size="md"
          isRequired={true}
          className={`w-3/4 border-[#94A3B8] mb-6`}
        >
          <InputSlot className="pl-3">
            <InputIcon as={Search} color="#94A3B8"></InputIcon>
          </InputSlot>
          <InputField
            placeholder="Enter the airport ICAO"
            maxLength={4}
            placeholderTextColor={"#94A3B8"}
            autoCapitalize="characters"
          ></InputField>
        </Input>
        <Button
          variant="solid"
          size="md"
          action="primary"
          className="bg-brand mb-3"
        >
          <ButtonText>Click me</ButtonText>
        </Button>
        <ThemedText styles="text-[#94A3B8] text-sm text-center">
          Quickly acces METAR data for any airport around the planet.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
