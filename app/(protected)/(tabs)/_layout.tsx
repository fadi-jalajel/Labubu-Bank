// import Ionicons from "@expo/vector-icons/Ionicons";
// import { Tabs } from "expo-router";
// import React from "react";
// import AnimatedTabBar from "@/components/AnimatedTabBar";

// const TabsLayout = () => {
//   return (
//     <Tabs
//       tabBar={(props) => <AnimatedTabBar {...props} />}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: "Home",
//           headerShown: false,
//         }}
//       />
//       <Tabs.Screen
//         name="transactions"
//         options={{
//           title: "Transactions",
//           headerShown: false,
//         }}
//       />
//       <Tabs.Screen
//         name="atm"
//         options={{
//           title: "ATM",
//           headerShown: false,
//         }}
//       />
//     </Tabs>
//   );
// };

// export default TabsLayout;

import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTabBar from "@/components/AnimatedTabBar"; // <- adjust path to your tab bar file

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <AnimatedTabBar
          {...props}
          // @ts-ignore (safe to pass; your component can accept it)
          bottomOffset={Math.max(16, insets.bottom)}
        />
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="atm" />
      {/* <Tabs.Screen name="profile" /> if you have it */}
    </Tabs>
  );
}
