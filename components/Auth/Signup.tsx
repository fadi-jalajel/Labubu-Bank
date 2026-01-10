import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import AuthContext from "@/context/AuthContext";
import { LabubuInfo } from "./types";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api/auth";
import { storeToken } from "@/api/storage";

const SignupScreen = () => {
  //Initializing state to capture user sign up input
  const [labubuInfo, setLabubuInfo] = useState<LabubuInfo>({
    username: "",
    password: "",
    displayname: "",
    image: null,
  });
  //Tracking Loading Status for image picking
  const [isLoading, setIsLoading] = useState(false);

  //global user authentication state
  const { setIsAuthenticated } = useContext(AuthContext);

  // later you will replace this with image picker
  //   const DEFAULT_IMAGE = "https://placehold.co/300x300/png?text=Labubu";

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert(
        "Permission required",
        "We need access to your photos so you can pick an image."
      );
      return false;
    }

    return true;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      //   Alert.alert(
      //     "Permission required",
      //     "Permission to access the media library is required."
      //   );
      return;
    }

    try {
      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedAsset = result.assets[0];
        setLabubuInfo({ ...labubuInfo, image: pickedAsset });
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Something went wrong", "Could not pick the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const { mutate, isError, isPending } = useMutation({
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

    if (profileImage) {
      const mimeType = profileImage.mimeType ?? "image/jpeg";
      const extension = mimeType.split("/")[1];

      // Normalize URI for React Native (ensure file:// prefix if local file)
      let imageUri = profileImage.uri;
      if (
        imageUri &&
        !imageUri.startsWith("http") &&
        !imageUri.startsWith("file://")
      ) {
        imageUri = `file://${imageUri}`;
      }

      formData.append("image", {
        uri: imageUri,
        name: profileImage.fileName ?? `profile.${extension}`,
        type: mimeType,
      } as any);
    }

    // Debug logging
    console.log("FormData username:", composedUsername);
    console.log("FormData has image:", !!profileImage);
    if (profileImage) {
      console.log("Image URI:", profileImage.uri);
    }

    mutate(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Labubu 🧸</Text>
        <Text style={styles.subtitle}>Join the Labubu Bank</Text>

        <View style={styles.avatarContainer}>
          <Pressable onPress={handlePickImage} style={styles.avatarButton}>
            {labubuInfo.image?.uri ? (
              <Image
                source={{ uri: labubuInfo.image.uri }}
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
    </KeyboardAvoidingView>
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
