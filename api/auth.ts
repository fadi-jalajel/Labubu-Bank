import { LabubuInfo, LabubuSigninInfo } from "@/components/Auth/types";
import instance from "./index";

const signin = async (labubuCredentialsInfo: LabubuSigninInfo) => {
  const response = await instance.post("/api/auth/login", {
    username: labubuCredentialsInfo.username,
    password: labubuCredentialsInfo.password,
  });
  return response.data;
};

const signup = async (labubuInfo: FormData) => {
  try {
    console.log("📤 Sending signup request...");
    const response = await instance.post("/api/auth/register", labubuInfo);
    console.log("✅ Signup successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("❌ Signup error details:");
    console.log("Error:", error);
    console.log("Error response:", error?.response);
    console.log(
      "Error response data:",
      JSON.stringify(error?.response?.data, null, 2)
    );
    console.log("Error response status:", error?.response?.status);
    console.log("Error response headers:", error?.response?.headers);
    throw error;
  }
};

export { signin, signup };
