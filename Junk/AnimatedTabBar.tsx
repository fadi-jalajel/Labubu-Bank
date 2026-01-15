import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_WIDTH = 80;
const BAR_HEIGHT = 64;
const INNER_PADDING = 8;
const INDICATOR_WIDTH = 50;
const INDICATOR_HEIGHT = 48;

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
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
  };

  const bottomOffset = Math.max(12, insets.bottom);

  return (
    <View
      style={[styles.absoluteWrapper, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          { width: TAB_WIDTH * state.routes.length + INNER_PADDING * 2 },
        ]}
        pointerEvents="auto"
      >
        {/* ✅ Blur as background only */}
        <BlurView
          intensity={40}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Foreground (touchable) content */}
        <View style={styles.innerRow} pointerEvents="auto">
          <Animated.View
            pointerEvents="none"
            style={[styles.indicator, { transform: [{ translateX }] }]}
          />

          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              console.log("PRESSED:", route.name); // keep for 1 run then remove

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.tab}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
    alignItems: "center",
  },
  container: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
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
