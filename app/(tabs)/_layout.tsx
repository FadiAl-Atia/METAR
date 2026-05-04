import React from "react";
import { Tabs } from "expo-router";
import { Search, Cloud } from "lucide-react-native";
import "../../global.css";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: () => {
            return <Search></Search>;
          },
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
  );
}
