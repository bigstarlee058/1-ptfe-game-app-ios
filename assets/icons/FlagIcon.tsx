import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { verticalScale } from "src/config/scale"; // Adjust the import based on your file structure

export default function FlagIcon({ size = verticalScale(18) }) {
  return (
    <View style={styles.container}>
      <Svg
        width={size}  // Set the dynamic size
        height={size}
        viewBox="0 0 18 18"  // The original viewBox for the ShowIcon
        fill="none"
      >
        {/* ShowIcon's SVG path */}
        <Path
            d="M5 3v18M5 3h13l-2 5 2 5H5"
            stroke="#FF3B30" // Apple-style red
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
