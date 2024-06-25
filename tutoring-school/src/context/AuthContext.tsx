import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { TOKEN_KEY } from "../constants/StringContants";
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
  onRegister?: ({}) => Promise<any>;
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
      const token: string | null = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const loggedUserId = jwtDecode(token!).id;

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

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.data.token}`;

      const loggedUserId = jwtDecode(loginResponse.data.token).id;

      const loggedUser = await userApi.getUser(loggedUserId);

      setAuthState({
        token: loginResponse.data.token,
        authenticated: true,
        user: loggedUser,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, loginResponse.data.token);
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const register = async (userData: object) => {
    try {
      const registerResponse = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      console.log(registerResponse);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

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
