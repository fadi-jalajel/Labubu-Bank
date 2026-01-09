import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { signin } from "@/api/auth";
import { storeToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";

const SignInScreen = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [labubuCredentials, setLabubuCredentials] = useState({
    username: "",
    password: "",
  });

  const { mutate, isError, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,
    onSuccess: async (data) => {
      storeToken(data.token);
      setIsAuthenticated(true);
      setLabubuCredentials({
        ...labubuCredentials,
        username: "",
        password: "",
      });
    },
  });

  const handleSignIn = () => {
    mutate(labubuCredentials);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 🧸</Text>
      <Text style={styles.subtitle}>Sign in to your Labubu</Text>

      <TextInput
        placeholder="Username"
        value={labubuCredentials.username}
        onChangeText={(text) =>
          setLabubuCredentials({ ...labubuCredentials, username: text })
        }
        style={styles.input}
        autoCapitalize="none"
        editable={!isPending}
      />

      <TextInput
        placeholder="Password"
        value={labubuCredentials.password}
        onChangeText={(text) =>
          setLabubuCredentials({ ...labubuCredentials, password: text })
        }
        style={styles.input}
        secureTextEntry
        editable={!isPending}
      />

      {isError && <Text style={styles.error}>Something went wrong</Text>}

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>
          {isPending ? "Signing in..." : "Sign In"}
        </Text>
      </Pressable>

      {/* Signup link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have a Labubu Account?</Text>
        <Link href="/(auth)/signup" style={styles.link}>
          Create one
        </Link>
      </View>
    </View>
  );
};

export default SignInScreen;

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
    marginBottom: 32,
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
});
