import { getProfile } from "@/api/profile";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import Spinner from "../Loading/Spinner";

const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

function extractUserName(username: string | undefined) {
  if (!username) return { displayName: "Unknown" };
  const parts = username.split("__");
  return {
    userNamePart: parts[0],
  };
}

function extractDisplayName(username: string | undefined) {
  if (!username) return { displayName: "Unknown" };
  const parts = username.split("__");
  return {
    displayNamePart: parts[1] ?? parts[0],
  };
}

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

  if (isLoading) return <Spinner size="large" color={"#000"} />;

  // Handle nested profile response
  const currentUser = data?.data || data?.user;

  if (!currentUser) return null;

  const { userNamePart } = extractUserName(currentUser.username);
  const { displayNamePart } = extractDisplayName(currentUser.username);

  const myImage = `${BASE_URL}/${currentUser.imagePath}`;
  const myBalance = data?.data.balance;

  return (
    <View style={styles.container}>
      {/* LOGOUT */}
      <View style={styles.header}>
        <Pressable onPress={logout} hitSlop={10}>
          <MaterialIcons name="logout" size={26} color="#999" />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Your Labubu Account</Text>
      {/* PROFILE CARD */}
      <View style={styles.card}>
        <Image
          source={{ uri: myImage || userImage }}
          style={styles.profileImage}
        />
      </View>
      <View>
        <Text style={styles.userName}>Hi, {displayNamePart}</Text>
        <Text style={styles.userName}>{userNamePart}</Text>
        <Text style={styles.quoteText}>`Your are worth ${myBalance}$`</Text>
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
