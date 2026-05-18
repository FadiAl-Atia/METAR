import { ActivityIndicator, Image, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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
import * as Location from "expo-location";
import ThemedTextBold from "@/components/themed-bold";

type NearbyAirport = {
  icao: string;
  iata: string;
  name: string;
  shortName: string;
  municipalityName: string;
  location: { lat: number; lon: number };
  countryCode: string;
};

export default function index() {
  const [airport, setAirport] = useState("");
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [airportsList, setAirportsList] = useState<NearbyAirport[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchNearbyAirports = async (lat: number, lon: number) => {
    const res = await axios.request({
      method: "GET",
      url: "https://aerodatabox.p.rapidapi.com/airports/search/location",
      params: {
        lat: lat,
        lon: lon,
        radiusKm: "500",
        limit: "3",
        withFlightInfoOnly: "false",
      },
      headers: {
        "x-rapidapi-key": process.env.EXPO_PUBLIC_AERODATA_API_KEY,
        "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    });
    const items: NearbyAirport[] = res.data?.items ?? [];
    setAirportsList(items);
    console.log("Airports Nearby:", items);
    return res.data;
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchNearbyAirports(location.coords.latitude, location.coords.longitude);
    }

    getCurrentLocation();
  }, []);

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
                  ></InputField>
                </Input>
                {!field.state.meta.isValid && (
                  <ThemedText styles="text-red-500 mb-4">
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
        >
          <ButtonText>Submit</ButtonText>
        </Button>
        <ThemedText styles="text-[#94A3B8] text-sm text-center mb-8">
          Quickly acces METAR data for any airport around the planet.
        </ThemedText>
        <View className="bg-white w-3/4 items-center rounded justify-center p-4">
          <ThemedTextBold styles="mb-4">Nearby Airports:</ThemedTextBold>
          <View className="justify-center items-center gap-4">
            {airportsList.length > 0 ? (
              <View>
                {airportsList.map((airport) => (
                  <ThemedTextBold key={airport.icao}>
                    {airport.icao}
                  </ThemedTextBold>
                ))}
              </View>
            ) : (
              <ActivityIndicator
                size={"large"}
                color={"#e6ebf0"}
              ></ActivityIndicator>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
