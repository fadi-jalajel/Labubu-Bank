import * as SecureStore from "expo-secure-store";

const storeToken = async (token: string | undefined | null) => {
  try {
    // Ensure token is a string before storing
    if (!token) {
      console.log("⚠️ storeToken: No token provided");
      return;
    }

    // Convert to string if it's not already (handles edge cases)
    const tokenString = typeof token === "string" ? token : String(token);

    await SecureStore.setItemAsync("token", tokenString);
    console.log("✅ Token stored successfully");
  } catch (error) {
    console.log("🚀 ~ storeToken ~ error:", error);
    throw error; // Re-throw so callers can handle it
  }
};

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    return token;
  } catch (error) {
    console.log("🚀 ~ getToken ~ error:", error);
  }
};

const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
  } catch (error) {
    console.log("🚀 ~ deleteToken ~ error:", error);
  }
};

export { storeToken, getToken, deleteToken };
