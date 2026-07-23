import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import ThemedTextBold from "@/components/themed-bold";
import { ScrollView, View } from "react-native";
import ThemedText from "@/components/themed";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Search } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function Favorties() {
  const [query, setQuery] = useState("");

  const form = useForm({
    defaultValues: {
      query: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-white">
      <Header></Header>
      <ScrollView
        className="flex-1 bg-white px-4 mt-4"
        contentContainerClassName="pb-8"
      >
        <View className="flex gap-2 mb-6">
          <ThemedTextBold styles="text-[32px]">Favorites</ThemedTextBold>
          <ThemedText>Quick access to your saved airports.</ThemedText>
        </View>
        <View className="flex w-full">
          <form.Field
            name="query"
            validators={{
              onChange: ({ value }) =>
                value.length <= 0
                  ? "Airport ICAO must not be empty"
                  : undefined,
            }}
            children={(field) => {
              return (
                <View>
                  <Input
                    variant="rounded"
                    size="md"
                    isRequired={true}
                    className={`w-3/4 border-[#94A3B8] mb-3 self-center`}
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
            className="bg-brand mb-3 w-1/4 self-center rounded"
            onPress={form.handleSubmit}
          >
            <ButtonText>Submit</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
