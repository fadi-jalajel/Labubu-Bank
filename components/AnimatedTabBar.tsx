import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TAB_WIDTH = 80;
const BAR_HEIGHT = 64;
const INNER_PADDING = 8;
const INDICATOR_WIDTH = 50;
const INDICATOR_HEIGHT = 48;

export default function AnimatedTabBar({
  state,
  navigation,
  bottomOffset = 16,
}: BottomTabBarProps & { bottomOffset?: number }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tabCenter = INNER_PADDING + state.index * TAB_WIDTH + TAB_WIDTH / 2;
    const indicatorLeft = tabCenter - INDICATOR_WIDTH / 2;

    Animated.spring(translateX, {
      toValue: indicatorLeft,
      damping: 15,
      stiffness: 120,
      useNativeDriver: true,
    }).start();
  }, [state.index, translateX]);

  const ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    home: "crown-outline",
    transactions: "history",
    atm: "transfer",
    profile: "account-circle-outline", // (optional) if you have profile
  };

  const tabCount = state.routes.length;

  return (
    // <View style={styles.absoluteWrapper} pointerEvents="box-none">
    <View
      style={[styles.absoluteWrapper, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View style={styles.centerRow} pointerEvents="box-none">
        <BlurView
          intensity={40}
          tint="dark"
          style={[
            styles.container,
            { width: TAB_WIDTH * tabCount + INNER_PADDING * 2 },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.innerRow} pointerEvents="box-none">
            {/* Active indicator - never steal touches */}
            <Animated.View
              pointerEvents="none"
              style={[styles.indicator, { transform: [{ translateX }] }]}
            />

            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => navigation.navigate(route.name as never)}
                  activeOpacity={0.85}
                  style={styles.tab}
                >
                  <MaterialCommunityIcons
                    name={ICONS[route.name] ?? "circle-outline"}
                    size={24}
                    color={isFocused ? "#2ECC71" : "white"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    justifyContent: "center",
  },
  innerRow: {
    flexDirection: "row",
    paddingHorizontal: INNER_PADDING,
    alignItems: "center",
    height: BAR_HEIGHT,
  },
  tab: {
    width: TAB_WIDTH,
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: (BAR_HEIGHT - INDICATOR_HEIGHT) / 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: "#fff",
  },
});
