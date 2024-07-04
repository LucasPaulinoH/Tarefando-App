import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "../services/User/type";
import { API_BASE_URL } from "../services/api";
import userApi from "../services/User";
import { jwtDecode } from "jwt-decode";

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
      const token = await SecureStore.getItemAsync("TOKEN_KEY");
      axios.defaults.headers.Authorization = null;

      if (token) {
        axios.defaults.headers.Authorization = token;

        const loggedUserId = jwtDecode<{ id: string }>(token).id;

        const loggedUser: User = await userApi.getUser(loggedUserId);
        setAuthState({ token, authenticated: true, user: loggedUser });
      } else {
        setAuthState({ token: null, authenticated: false, user: null });
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

      axios.defaults.headers.Authorization = loginResponse.data.token;

      const loggedUserId = jwtDecode<{ id: string }>(
        loginResponse.data.token
      ).id;

      const loggedUser = await userApi.getUser(loggedUserId);

      setAuthState({
        token: loginResponse.data.token,
        authenticated: true,
        user: loggedUser,
      });

      await SecureStore.setItemAsync("TOKEN_KEY", loginResponse.data.token);
    } catch (error: any) {
      console.log("Error during login: ", error.response);
    }
  };

  const register = async (userData: object): Promise<User> => {
    let newUser = null;
    try {
      const registerResponse = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      newUser = registerResponse.data;
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
