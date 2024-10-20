import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "../services/User/type";
import userApi from "../services/User";
import { jwtDecode } from "jwt-decode";
import authApi from "../services/Auth";
import { Alert } from "react-native";

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
    SecureStore.getItemAsync("TOKEN_KEY").then((recoveredToken) => {
      axios.defaults.headers.Authorization = null;

      if (recoveredToken) {
        axios.defaults.headers.Authorization = recoveredToken;
        const loggedUserId = jwtDecode(recoveredToken).id;

        userApi.getUser(loggedUserId).then((loggedUser) => {
          setAuthState({
            token: recoveredToken,
            authenticated: true,
            user: loggedUser,
          });
        });
      }

      if (!recoveredToken) {
        setAuthState({ token: null, authenticated: false, user: null });
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await authApi.login(email, password);
      const receivedToken = loginResponse.token;

      axios.defaults.headers.Authorization = receivedToken;

      const loggedUserId = jwtDecode(receivedToken).id;
      const loggedUser = await userApi.getUser(loggedUserId);

      setAuthState({
        token: receivedToken,
        authenticated: true,
        user: loggedUser,
      });

      await SecureStore.setItemAsync("TOKEN_KEY", receivedToken);
    } catch (error: any) {
      console.log("Error during login: ", error.response);
      Alert.alert(
        "Erro no login",
        "Credenciais inválidas",
        [
          {
            text: "Voltar",
          },
        ],
        { cancelable: false }
      );
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
