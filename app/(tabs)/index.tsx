import { Image, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import ThemedText from "@/components/themed";
import { Button, ButtonText } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import { z } from "zod";
export default function index() {
  const [airport, setAirport] = useState("");
  const queryClient = useQueryClient();

  const fetchMetar = async (icao: string) => {
    const res = await axios.request({
      method: "get",
      url: `https://api.checkwx.com/v2/metar/${icao}/decoded`,
      headers: { "X-API-KEY": process.env.EXPO_PUBLIC_CHECKWX_API_KEY },
    });
    return res.data;
  };

  const form = useForm({
    defaultValues: {
      airport: "KJFK",
    },
    onSubmit: async ({ value }) => {
      setAirport(value.airport);
      console.log(value.airport);
      const data = await queryClient.fetchQuery({
        queryKey: ["metar", value.airport],
        queryFn: () => fetchMetar(value.airport),
      });
      console.log(JSON.stringify(data));
      router.navigate({
        pathname: "/(tabs)/METAR",
        params: {
          metar: JSON.stringify(data),
        },
      });
    },
  });

  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header />
      <View className="flex-1 bg-text-nuetral justify-center items-center">
        <View className="h-16 w-16 bg-[#e6ebf0] flex justify-center items-center rounded-full mb-6 ">
          <Image
            source={require("../../assets/logo/logo-no-bg.png")}
            height={32}
            width={32}
            className="w-8 h-8"
          />
        </View>
        <form.Field
          name="airport"
          validators={{
            onChange: ({ value }) =>
              value.length <= 0 ? "Airport ICAO must not be empty" : undefined,
          }}
          children={(field) => {
            return (
              <View>
                <Input
                  variant="rounded"
                  size="md"
                  isRequired={true}
                  className={`w-3/4 border-[#94A3B8] mb-3`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Search} color="#94A3B8"></InputIcon>
                  </InputSlot>
                  <InputField
                    placeholder="Enter the airport ICAO"
                    maxLength={4}
                    placeholderTextColor={"#94A3B8"}
                    autoCapitalize="characters"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    selectTextOnFocus
                    onChange={(e) => field.handleChange(e.nativeEvent.text)}
                    testID="ICAOInput"
                  ></InputField>
                </Input>
                {!field.state.meta.isValid && (
                  <ThemedText styles="text-red-500 mb-4" testID="ErrorText">
                    {field.state.meta.errors.join(", ")}
                  </ThemedText>
                )}
              </View>
            );
          }}
        ></form.Field>

        <Button
          variant="solid"
          size="md"
          action="primary"
          className="bg-brand mb-3"
          onPress={form.handleSubmit}
          testID="SubmitButton"
        >
          <ButtonText>Submit</ButtonText>
        </Button>
        <ThemedText styles="text-[#94A3B8] text-sm text-center">
          Quickly acces METAR data for any airport around the planet.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
