import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Search, Cloud } from "lucide-react-native";
import "../../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

export default function _layout() {
  const [loaded, error] = useFonts({
    Mono: require("../../assets/fonts/mono/SpaceMono-Regular.ttf"),
    MonoBold: require("../../assets/fonts/mono/SpaceMono-Bold.ttf"),
  });

  const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Mono",
              marginTop: 2,
            },
            tabBarStyle: {
              backgroundColor: "white",
              borderRadius: 8,
            },

            tabBarActiveTintColor: "#1565C0",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ color }) => {
                return <Search color={color}></Search>;
              },
              title: "Search",
            }}
          ></Tabs.Screen>
          <Tabs.Screen
            name="METAR"
            options={{
              title: "METAR",
              tabBarIcon: ({ color }) => {
                return <Cloud color={color}></Cloud>;
              },
            }}
          ></Tabs.Screen>
        </Tabs>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
