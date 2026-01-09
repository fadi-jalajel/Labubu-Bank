import { createContext } from "react";

//declaring the global authorization state
interface AuthContextProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

//initializing the global authorization state
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export default AuthContext;
