import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {
  API_URL as API_BASE_URL,
  TOKEN_KEY,
} from "../constants/StringContants";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored token:", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("login response:", loginResponse.data);

      setAuthState({
        token: loginResponse.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, loginResponse.data.token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
