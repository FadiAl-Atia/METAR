import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import ThemedTextBold from "@/components/themed-bold";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import ThemedText from "@/components/themed";
import { useMemo, useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react-native";

import { searchAirports, type Airport } from "@/lib/airports";
import { useFavorites } from "@/hooks/use-favorites";

export default function Favorties() {
  const [query, setQuery] = useState("");
  const { favorites, loading, add, remove, isFavorite } = useFavorites();

  const results = useMemo(() => searchAirports(query), [query]);

  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header></Header>
      <ScrollView
        className="flex-1 bg-white px-4 mt-4"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex gap-2 mb-6">
          <ThemedTextBold styles="text-[32px]">Favorites</ThemedTextBold>
          <ThemedText>Quick access to your saved airports.</ThemedText>
        </View>

        <Input
          variant="rounded"
          size="md"
          className="w-full border-[#94A3B8] mb-4"
        >
          <InputSlot className="pl-3">
            <InputIcon as={Search} color="#94A3B8"></InputIcon>
          </InputSlot>
          <InputField
            placeholder="Search by ICAO, name or city"
            placeholderTextColor={"#94A3B8"}
            autoCapitalize="characters"
            autoCorrect={false}
            value={query}
            onChange={(e) => setQuery(e.nativeEvent.text)}
          ></InputField>
        </Input>

        {query.trim().length >= 2 && (
          <View className="mb-8">
            <ThemedTextBold styles="mb-3">Results</ThemedTextBold>
            {results.length === 0 ? (
              <ThemedText styles="text-[#94A3B8]">
                No airports match "{query.trim()}".
              </ThemedText>
            ) : (
              <View className="gap-2">
                {results.map((airport) => (
                  <AirportRow
                    key={airport.icao}
                    airport={airport}
                    saved={isFavorite(airport.icao)}
                    onAdd={() => add(airport)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <ThemedTextBold styles="mb-3">Saved airports</ThemedTextBold>
        {loading ? (
          <ActivityIndicator size="large" color="#1565C0" />
        ) : favorites.length === 0 ? (
          <ThemedText styles="text-[#94A3B8]">
            Nothing saved yet. Search above and tap + to add an airport.
          </ThemedText>
        ) : (
          <View className="gap-2">
            {favorites.map((favorite) => (
              <View
                key={favorite.icao}
                className="flex flex-row items-center justify-between p-4 bg-white rounded-lg shadow-lg shadow-black/20"
              >
                <View className="flex-1 pr-3">
                  <ThemedTextBold styles="text-brand">
                    {favorite.icao}
                    {favorite.iata ? ` / ${favorite.iata}` : ""}
                  </ThemedTextBold>
                  <ThemedText styles="text-sm">{favorite.name}</ThemedText>
                  {!!favorite.city && (
                    <ThemedText styles="text-xs text-[#94A3B8]">
                      {favorite.city}
                      {favorite.country ? `, ${favorite.country}` : ""}
                    </ThemedText>
                  )}
                </View>
                <Pressable
                  onPress={() => remove(favorite.icao)}
                  hitSlop={8}
                  className="p-2"
                >
                  <Trash2 color="#DC2626" size={20} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AirportRow({
  airport,
  saved,
  onAdd,
}: {
  airport: Airport;
  saved: boolean;
  onAdd: () => void;
}) {
  return (
    <View className="flex flex-row items-center justify-between p-4 bg-white rounded-lg shadow-lg shadow-black/20">
      <View className="flex-1 pr-3">
        <ThemedTextBold styles="text-brand">
          {airport.icao}
          {airport.iata ? ` / ${airport.iata}` : ""}
        </ThemedTextBold>
        <ThemedText styles="text-sm">{airport.name}</ThemedText>
        {!!airport.city && (
          <ThemedText styles="text-xs text-[#94A3B8]">
            {airport.city}
            {airport.country ? `, ${airport.country}` : ""}
          </ThemedText>
        )}
      </View>
      {saved ? (
        <ThemedText styles="text-xs text-[#94A3B8] p-2">Saved</ThemedText>
      ) : (
        <Pressable onPress={onAdd} hitSlop={8} className="p-2">
          <Plus color="#1565C0" size={20} />
        </Pressable>
      )}
    </View>
  );
}
