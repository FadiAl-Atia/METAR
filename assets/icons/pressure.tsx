import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

export default function Pressure() {
  return (
    <Svg width="16" height="21" viewBox="0 0 16 21" fill="none">
      <Path
        d="M0 13V11H16V13H0ZM0 10V8H16V10H0ZM7 21V17.8L5.4 19.4L4 18L8 14L12 18L10.6 19.4L9 17.85V21H7ZM8 7L4 3L5.4 1.6L7 3.2V0H9V3.2L10.6 1.6L12 3L8 7Z"
        fill="#1A2E4A"
      />
    </Svg>
  );
}
