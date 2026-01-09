import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthContext from "@/context/AuthContext";
import React, { useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getInitialURL } from "expo-router/build/link/linking";
import { getItemAsync } from "expo-secure-store";
import Spinner from "@/components/Loading/Spinner";

export default function RootLayout() {
  //decalring QueryClient (wraping the app)
  const queryClient = new QueryClient();

  //declaring athentication state to capature authencation status
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  //const { setIsAuthenticated } = useContext(AuthContext);

  //Checking if the user has a valid token
  const checkLabubuToken = async () => {
    const labubuToken = await getItemAsync("token");
    if (labubuToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkLabubuToken();
  }, []);

  if (isAuthenticated === null) return <Spinner size="large" color={"gray"} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, marginBottom: 0, backgroundColor: "#2D2E2F" }}
        edges={["top", "left", "right"]}
      >
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <Stack>
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
                  headerShadowVisible: false,
                  headerTintColor: "#deddd1ff",
                  headerTitleStyle: { color: "#deddd1ff" },
                  headerStyle: { backgroundColor: "#2D2E2F" },
                }}
              />
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen
                  name="(protected)/(tabs)"
                  options={{
                    headerShown: false,
                    headerTintColor: "#deddd1ff",
                    headerTitleStyle: { color: "#deddd1ff" },
                    headerStyle: { backgroundColor: "#2D2E2F" },
                  }}
                />
              </Stack.Protected>
              <Stack.Screen
                name="index"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerTintColor: "#deddd1ff",
                  headerTitleStyle: { color: "#deddd1ff" },
                  headerStyle: { backgroundColor: "#2D2E2F" },
                }}
              />
            </Stack>
          </AuthContext.Provider>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
