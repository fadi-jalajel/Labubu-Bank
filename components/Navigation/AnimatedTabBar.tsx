import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

/* =======================
   CONFIG
======================= */

const BAR_HEIGHT = 64;
const TAB_WIDTH = 80;
const PADDING = 8;

const INDICATOR_SIZE = 48; // circle/pill height
const INDICATOR_WIDTH = 50;

/* =======================
   ICON MAP
======================= */

const ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  home: "crown-outline",
  transactions: "transfer",
  atm: "air-filter",
};

/* =======================
   COMPONENT
======================= */

export default function AnimatedTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tabCenter = PADDING + state.index * TAB_WIDTH + TAB_WIDTH / 2;

    const indicatorX = tabCenter - INDICATOR_WIDTH / 2;

    Animated.spring(translateX, {
      toValue: indicatorX,
      damping: 14,
      stiffness: 120,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.absoluteWrapper}>
      <BlurView intensity={40} tint="dark" style={styles.bar}>
        <View style={styles.innerRow}>
          {/* Active Indicator */}
          <Animated.View
            style={[styles.indicator, { transform: [{ translateX }] }]}
          />

          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(route.name as never)}
              >
                <MaterialCommunityIcons
                  name={ICONS[route.name]}
                  size={24}
                  color={isFocused ? "#2ECC71" : "#FFFFFF"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    paddingHorizontal: PADDING,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },

  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tab: {
    width: TAB_WIDTH,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  indicator: {
    position: "absolute",
    left: 0,
    top: (BAR_HEIGHT - INDICATOR_SIZE) / 2,
    width: INDICATOR_WIDTH,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
});
