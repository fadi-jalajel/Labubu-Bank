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
  const response = await instance.post("/api/auth/register", labubuInfo);
  return response.data;
};

export { signin, signup };
