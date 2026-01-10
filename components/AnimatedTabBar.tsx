import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TAB_WIDTH = 80;
const BAR_HEIGHT = 64;
const INNER_PADDING = 8;

export default function AnimatedTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      damping: 15,
      stiffness: 120,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    home: "crown-outline",
    transactions: "queue-first-in-last-out",
    atm: "air-filter",
  };

  const tabCount = state.routes.length;

  return (
    <View style={styles.absoluteWrapper}>
      <View style={styles.centerRow}>
        <BlurView
          intensity={40}
          tint="dark"
          style={[
            styles.container,
            { width: TAB_WIDTH * tabCount + INNER_PADDING * 2 },
          ]}
        >
          {/* INNER ROW (shared coordinate space) */}
          <View style={styles.innerRow}>
            {/* Active indicator */}
            <Animated.View
              style={[styles.indicator, { transform: [{ translateX }] }]}
            />

            {state.routes.map((route) => {
              const isFocused = state.routes[state.index].key === route.key;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => navigation.navigate(route.name as never)}
                  activeOpacity={0.85}
                  style={styles.tab}
                >
                  <MaterialCommunityIcons
                    name={ICONS[route.name]}
                    size={24}
                    color={isFocused ? "#2ECC71" : "#aaa"}
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
  },
  tab: {
    width: TAB_WIDTH,
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  indicator: {
    position: "absolute",
    left: 0,
    width: TAB_WIDTH,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
});
