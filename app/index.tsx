import { Redirect } from "expo-router";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    // Still checking auth state, return null or a loading spinner
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  // Not authenticated, redirect to signin
  return <Redirect href="/(auth)/signin" />;
}
