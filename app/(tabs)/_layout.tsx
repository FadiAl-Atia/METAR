import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Search, Cloud } from "lucide-react-native";
import "../../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function _layout() {
  const [loaded, error] = useFonts({
    Mono: require("../../assets/fonts/mono/SpaceMono-Regular.ttf"),
    MonoBold: require("../../assets/fonts/mono/SpaceMono-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: () => {
              return <Search color={"#1a2e4a"}></Search>;
            },
            title: "Search",
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="METAR"
          options={{
            title: "METAR",
            tabBarIcon: () => {
              return <Cloud></Cloud>;
            },
          }}
        ></Tabs.Screen>
      </Tabs>
    </GluestackUIProvider>
  );
}
