import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "../services/User/type";
import { API_BASE_URL } from "../services/api";
import userApi from "../services/User";
import { jwtDecode } from "jwt-decode";
import authApi from "../services/Auth";

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    user: User | null;
  };
  onLogin?: (email: string, password: string) => Promise<any>;
  onRegister?: (userData: object) => Promise<any>;
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
    user: User | null;
  }>({ token: null, authenticated: null, user: null });

  useEffect(() => {
    const loadToken = async () => {
      const recoveredToken = await SecureStore.getItemAsync("TOKEN_KEY");
      axios.defaults.headers.Authorization = null;

      if (recoveredToken) {
        axios.defaults.headers.Authorization = recoveredToken;
        const loggedUserId = jwtDecode<{ id: string }>(recoveredToken).id;
        const loggedUser = await userApi.getUser(loggedUserId);

        setAuthState({
          token: recoveredToken,
          authenticated: true,
          user: loggedUser,
        });
      } else {
        setAuthState({ token: null, authenticated: false, user: null });
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await authApi.login(email, password);
      const receivedToken = loginResponse.token;

      axios.defaults.headers.Authorization = receivedToken;

      const loggedUserId = jwtDecode<{ id: string }>(receivedToken).id;
      const loggedUser = await userApi.getUser(loggedUserId);

      setAuthState({
        token: receivedToken,
        authenticated: true,
        user: loggedUser,
      });

      await SecureStore.setItemAsync("TOKEN_KEY", receivedToken);
    } catch (error: any) {
      console.log("Error during login: ", error.response);
    }
  };

  const register = async (userData: object): Promise<User> => {
    let newUser = null;
    try {
      const registerResponse = await authApi.register(userData);
      newUser = registerResponse;
    } catch (error: any) {
      console.error("Register error:", error.response);
    }

    return newUser;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("TOKEN_KEY");
    axios.defaults.headers.Authorization = null;

    setAuthState({
      token: null,
      authenticated: false,
      user: null,
    });
  };

  const value = {
    onLogin: login,
    onRegister: register,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
