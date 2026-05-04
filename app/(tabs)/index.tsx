import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function index() {
  return (
    <View style={styles.layout}>
      <Text>Hi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
