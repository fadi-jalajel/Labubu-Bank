import React from "react";
import { ActivityIndicator, ColorValue, StyleSheet, View } from "react-native";

interface SpinnerType {
  size: "large" | "small";
  color: ColorValue;
}

const Spinner = ({ size, color }: SpinnerType) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
