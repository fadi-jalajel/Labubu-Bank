// import { Tabs } from "expo-router";
// import AnimatedTabBar from "@/components/Navigation/AnimatedTabBar";

// export default function TabLayout() {
//   return (
//     <Tabs
//       tabBar={(props) => <AnimatedTabBar {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tabs.Screen name="home" />
//       <Tabs.Screen name="transactions" />
//       <Tabs.Screen name="atm" />
//     </Tabs>
//   );
// }

import { Tabs } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4a90e2",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false, // <-- Add this line to hide titles
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="crown-outline"
              size={33}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          // title: "Transactions",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={33} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="atm"
        options={{
          // title: "ATM",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="transfer" size={33} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
// export default TabsLayout;

// import React from "react";
// import { Tabs } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function TabsLayout() {
//   const insets = useSafeAreaInsets();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//       }}
//       // tabBar={(props) => (
//       //   <AnimatedTabBar
//       //     {...props}
//       //     // @ts-ignore (safe to pass; your component can accept it)
//       //     bottomOffset={Math.max(16, insets.bottom)}
//       //   />
//       // )}
//     >
//       <Tabs.Screen name="home" />
//       <Tabs.Screen name="transactions" />
//       <Tabs.Screen name="atm" />
//       {/* <Tabs.Screen name="profile" /> if you have it */}
//     </Tabs>
//   );
// }
