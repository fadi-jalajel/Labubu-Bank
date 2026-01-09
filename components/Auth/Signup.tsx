import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import { Link, useRouter } from "expo-router";
import AuthContext from "@/context/AuthContext";
import { LabubuInfo } from "./types";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api/auth";
import { storeToken } from "@/api/storage";
import { router } from "expo-router";

const SignupScreen = () => {
  //Initializing state to capture user sign up input
  const [labubuInfo, setLabubuInfo] = useState<LabubuInfo>({
    username: "",
    password: "",
    displayname: "",
    image: null,
  });

  //global user authentication state
  const { setIsAuthenticated } = useContext(AuthContext);

  // later you will replace this with image picker
  const DEFAULT_IMAGE = "https://placehold.co/300x300/png?text=Labubu";

  //sconst router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setLabubuInfo({ ...labubuInfo, image: result });
    }
  };

  const { mutate, isError, error, data, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: (data) => {
      storeToken(data.token);
      setIsAuthenticated(true);
      router.navigate("/(protected)/(tabs)/home");
    },
    onError: (error) => {
      console.log("🚀 ~ SignupScreen ~ error:", error);
    },
  });

  const handleSignUp = () => {
    if (!labubuInfo.username || !labubuInfo.password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    const formData = new FormData();
    const profileImage = labubuInfo.image;
    const composedUsername = `${labubuInfo.username}__${labubuInfo.displayname}`;
    formData.append("username", composedUsername);
    formData.append("password", labubuInfo.password);

    if (profileImage && profileImage.assets && profileImage.assets.length > 0) {
      formData.append("image", {
        uri: profileImage.assets[0].uri,
        name: profileImage.assets[0].fileName || "profile.jpg",
        type: profileImage.assets[0].type || "image/jpeg",
      } as any);
    }

    mutate(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Labubu 🧸</Text>
      <Text style={styles.subtitle}>Join the Labubu Bank</Text>

      <View style={styles.avatarContainer}>
        <Pressable onPress={pickImage} style={styles.avatarButton}>
          {labubuInfo.image?.assets?.[0]?.uri ? (
            <Image
              source={{ uri: labubuInfo.image.assets[0].uri }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>+</Text>
              <Text style={styles.avatarPlaceholderSubtext}>Add Photo</Text>
            </View>
          )}
        </Pressable>
      </View>

      <TextInput
        placeholder="Display Name"
        value={labubuInfo.displayname}
        onChangeText={(text) =>
          setLabubuInfo({ ...labubuInfo, displayname: text })
        }
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Username"
        value={labubuInfo.username}
        onChangeText={(text) =>
          setLabubuInfo({ ...labubuInfo, username: text })
        }
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={labubuInfo.password}
        onChangeText={(text) =>
          setLabubuInfo({ ...labubuInfo, password: text })
        }
        style={styles.input}
        secureTextEntry
      />

      {isError && <Text style={styles.error}>Something went wrong</Text>}

      <Pressable
        style={[styles.button, isPending && styles.disabled]}
        onPress={handleSignUp}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Creating Your Labubu..." : "Sign Up"}
        </Text>
      </Pressable>

      {/* Signin link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have a Labubu?</Text>
        <Link href="/(auth)/signin" style={styles.link}>
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: "#666",
  },
  link: {
    color: "#000",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 36,
    color: "#999",
    fontWeight: "300",
  },
  avatarPlaceholderSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  avatarButton: {
    borderRadius: 60,
    overflow: "hidden",
  },
});
