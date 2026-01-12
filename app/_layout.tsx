import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthContext from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import { getProfile } from "@/api/profile";
import Spinner from "@/components/Loading/Spinner";
import { useFonts } from "expo-font";
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { StatusBar } from "expo-status-bar";

//decalring QueryClient (wraping the app)
const queryClient = new QueryClient();

export default function RootLayout() {
  //declaring athentication state to capature authencation status
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  // Load Plus Jakarta Sans font
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  //const { setIsAuthenticated } = useContext(AuthContext);

  //Checking if the user has a valid token
  const checkLabubuToken = async () => {
    const labubuToken = await getItemAsync("token");

    if (!labubuToken) {
      setIsAuthenticated(false);
      return;
    }
    try {
      await getProfile();
      // If successful, token is valid
      setIsAuthenticated(true);
    } catch (error: any) {
      // Token is invalid or expired
      // Clear the invalid token
      try {
        await deleteItemAsync("token");
      } catch (deleteError) {
        // Silently fail if token deletion fails
      }
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkLabubuToken();
  }, []);

  //only checks if a token exists, not if it's valid. An old/invalid token in storage can make the app think you're authenticated.
  //Fix: Validate the token on app start, or default to unauthenticated and let the 401 interceptor handle invalid tokens.

  // Wait for fonts to load before rendering
  if (!fontsLoaded || isAuthenticated === null) {
    return <Spinner size="large" color={"gray"} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#2D2E2F" }}
        edges={[]} // Remove all edges for full screen
      >
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <Stack>
              <Stack.Screen name="index" />
              <Stack.Screen
                name="(auth)/signin"
                options={{
                  title: "Login",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)/signup"
                options={{
                  title: "",
                  headerShown: true,
                  headerTransparent: true,
                  headerBackTitle: "",
                  headerShadowVisible: false,
                  headerTintColor: "#000",
                  headerTitleStyle: { color: "#000" },
                  headerTitle: () => null,
                  headerStyle: { backgroundColor: "#transparent" },
                }}
              />
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen
                  name="(protected)/(tabs)"
                  options={{
                    headerShown: false,
                    headerBackTitle: "",
                    headerTintColor: "#deddd1ff",
                    headerTitleStyle: { color: "#deddd1ff" },
                    headerStyle: { backgroundColor: "#2D2E2F" },
                  }}
                />
                <Stack.Screen
                  name="(protected)/profile"
                  options={{
                    title: "My Labubu's Profile",
                    // headerShown: false, // or set title: "" to hide the title
                    contentStyle: { flex: 1 },
                  }}
                />
              </Stack.Protected>
            </Stack>
          </AuthContext.Provider>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
