import React from "react";
import { Tabs } from "expo-router";

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
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="METAR"
        options={{
          title: "METAR",
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
