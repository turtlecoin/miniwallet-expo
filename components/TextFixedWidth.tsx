import * as React from "react";
import { Platform } from "react-native";
import { Text } from "native-base";

export function TextFixedWidth({ children }: any) {
    const fontFamily = Platform.OS === "ios" ? "Courier New" : "monospace";

    return <Text style={{ fontFamily }}>{children}</Text>;
}
