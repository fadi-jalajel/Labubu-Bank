import { getProfile } from "@/api/profile";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import Spinner from "../Loading/Spinner";

const Profile = () => {
  const userName = "My Labubu";
  const userImage = "@/assets/labubu-avatars/hope.png";
  const foodQuote = "First Labubu Bank on the Planet";

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const logout = async () => {
    await deleteItemAsync("token");
    router.dismissTo("/(auth)/signin");
  };

  if (isLoading) return <Spinner size="large" color={"gray"} />;

  return (
    <View style={styles.container}>
      {/* LOGOUT */}
      <View style={styles.header}>
        <Pressable onPress={logout} hitSlop={10}>
          <MaterialIcons name="logout" size={26} color="#999" />
        </Pressable>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <Image
          source={{ uri: data?.image || userImage }}
          style={styles.profileImage}
        />

        <Text style={styles.userName}>{data?.username || userName}</Text>

        <Text style={styles.subtitle}>Labubu Account</Text>

        <Text style={styles.quoteText}>{foodQuote}</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    alignItems: "flex-end",
    paddingTop: 48,
    paddingBottom: 16,
  },

  /* CARD */
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileImage: {
    width: 160,
    height: 200, // slightly portrait-like (4:5 feel)
    borderRadius: 24,
    marginBottom: 24,
    resizeMode: "cover",
    backgroundColor: "#f2f2f2",
  },

  userName: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  quoteText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 22,
    fontStyle: "italic",
  },
});
