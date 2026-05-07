import React, { PropsWithChildren } from "react";
import { Text, View } from "react-native";

interface ThemedTextProps extends PropsWithChildren {
  //The "extends" allows you to have children without the hassle of defining types.
  styles?: string | undefined;
  testID?: string;
}
export default function ThemedText(props: ThemedTextProps) {
  //The props will have the styles and the content (children)
  return (
    <View>
      <Text
        className={`${props.styles ?? ""} font-[Mono]`}
        testID={props.testID}
      >
        {props.children}
      </Text>
    </View>
  );
}
