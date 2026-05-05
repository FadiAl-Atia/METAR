import { View, Text } from "react-native";
import React, { JSX, ReactNode } from "react";
import ThemedText from "./themed";

interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  r1_title: string;
  r1_value: number;
  r2_title: string;
  r2_value: number | string;
}

export default function InfoCard({
  title,
  icon,
  r1_title,
  r1_value,
  r2_title,
  r2_value,
}: InfoCardProps) {
  return (
    <View className="p-4 bg-white gap-4 w-full rounded-lg shadow-lg shadow-black/20 self-center">
      <View className="flex flex-row justify-between">
        <ThemedText>{title}</ThemedText>
        {icon}
      </View>
      <View className="flex flex-row justify-between">
        <ThemedText>{r1_title}</ThemedText>
        <ThemedText>{r1_value}%</ThemedText>
      </View>
      <View className="flex flex-row justify-between">
        <ThemedText>{r2_title}</ThemedText>
        <ThemedText>{r2_value}</ThemedText>
      </View>
    </View>
  );
}
